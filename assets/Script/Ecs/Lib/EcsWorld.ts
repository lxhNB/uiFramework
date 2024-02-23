// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ComPoolIndex, ComType, EntityIndex } from "./Const";
import { ECSComConstructor, GetComConstructor, GetComConstructorType } from "./EcsComponent";
import { EcsComponentPool } from "./EcsComponentPool";
import { ECSFilter } from "./EcsFilter";
import { EcsSystem } from "./EcsSystem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EcsWorld {
    //世界内所有的system
    private _systems: EcsSystem[] = [];
    private _entityIdxPools: number[] = [];//回收entity
    private _entityToComponents: number[][] = [];  //entity  component 二维表
    private _entitiesToDelete: Set<EntityIndex> = new Set();// 统一删除entity
    private _componentPools: EcsComponentPool<any>[] = []; //component pools
    private _filters = new Map<string, ECSFilter>;//筛选器map

    /**获取组件池 */
    public getComponentPool<T>(typeOrFunc: ComType | { prototype: T }): EcsComponentPool<T> {
        //
        let type = typeof typeOrFunc == "number" ? typeOrFunc : GetComConstructorType(typeOrFunc);
        if (!this._componentPools[type]) {
            //如果当前类型的 组件池是不存在,就新建
            this._componentPools[type] = new EcsComponentPool<T>(GetComConstructor(type));
        }
        return this._componentPools[type]
    }
    /**添加系统 */
    public addSystem(system: EcsSystem) {
        this._systems.push(system);
        system.onAdd(this);
        for (let i = 0; i < this._entityToComponents.length; i++) {
            system.onEntityEnter(this, i);
        }

    }
    /**移除一个系统 */
    public removeSystem(system: EcsSystem) {
        system.onRemove(this);
        for (let i = this._systems.length - 1; i >= 0; i--) {
            if (this._systems[i] == system) {
                this._systems.splice(i, 1);
                i++;
            }
        }
    }
    /**创建一个实体 */
    public createEntity() {
        let index = -1;
        if (this._entityIdxPools.length > 0) {
            index = this._entityIdxPools.pop();
        } else {
            index = this._entityToComponents.length;
            this._entityToComponents[index] = new Array<ComPoolIndex>(Object.keys(ComType).length / 2).fill(-1);
        }
        for (let system of this._systems) {
            system.onEntityEnter(this, index);
        }
        return index;
    }
    /**移除一个实体 */
    public removeEntity(entityIndex: EntityIndex): boolean {
        if (entityIndex <= 0) return false; 
        if(!this._entityToComponents[entityIndex]) {
            console.warn(`[ECSWorld] removeEntity entity is removed`);
            return false;
        }
        this._filters.forEach((fillter,key)=>{
            fillter.isContains(entityIndex) && fillter.onEntityLeave(entityIndex);
        })
        for (let system of this._systems) {
            system.onEntityLeave(this, entityIndex);
        }
        return true;
    }
    //
    public getComponentPoolIdx<T> (entityIndex:EntityIndex,com:{prototype:T} | ComType):ComPoolIndex{
        let entity = this._entityToComponents[entityIndex];
        if(!entity ) return -1;
        let type = typeof com == 'number' ? com : GetComConstructorType(com);
        return entity[type];

    }
    public getComponent<T>(entityIndex: EntityIndex, com: {prototype: T} | ComType) {
        let comPoolIdx = this.getComponentPoolIdx(entityIndex, com);
        if(comPoolIdx == -1) return null;
        return this.getComponentPool<T>(com).get(comPoolIdx);
    }

    public addComponent<T>(entityIndex: EntityIndex, com: {prototype: T}, dirty = true) {
        let entity = this._entityToComponents[entityIndex];
        if(!entity) return null;
        let type = GetComConstructorType(com);
        let comPoolIdx = entity[type];
        if(comPoolIdx == -1) {
            comPoolIdx = this.getComponentPool<T>(com).alloc();    
        }
        entity[type] = comPoolIdx;
        dirty && this.setEntityDirty(entityIndex);
        return this.getComponentPool<T>(com).get(comPoolIdx)
    }

    public removeComponent(entityIndex: EntityIndex, com: ECSComConstructor, dirty = true) {
        let entity = this._entityToComponents[entityIndex];
        if(!entity) return true;
        let type = GetComConstructorType(com);
        let comPoolIdx = entity[type];
        if(comPoolIdx == -1) return true;
        entity[type] = -1;
        this.getComponentPool(com).free(comPoolIdx);
        dirty && this.setEntityDirty(entityIndex);
        return true;
    }

    public removeAllComponents(entityIndex: EntityIndex, dirty = true) {
        let entity = this._entityToComponents[entityIndex];
        if(!entity) return null;
        for(let i=0; i<entity.length; i++) {
            if(entity[i] == -1) continue;
            this.getComponentPool(i).free(entity[i]);
            entity[i] = -1;
        }
        dirty && this.setEntityDirty(entityIndex);
    }

    public getSingletonComponent<T>(com: {prototype: T}): T {
        let component = this.getComponent(0, com);
        if(!component) {
            component = this.addComponent(0, com);
        }
        return component;
    }

    public setEntityDirty(entityIndex: EntityIndex): void {
        this._filters.forEach((fillter, key) => {
            let accept = !this._entitiesToDelete.has(entityIndex) && fillter.isAccept(entityIndex);
            if(accept != fillter.isContains(entityIndex)) {
                accept ? fillter.onEntityEnter(entityIndex) : fillter.onEntityLeave(entityIndex);
            }
        });
    }


    public getFilter(fillterKey: string): ECSFilter {
        if(this._filters.has(fillterKey)) {
            return this._filters.get(fillterKey);
        }
        let [acceptStr, rejectStr] = fillterKey.split("-");
        let accept = acceptStr && acceptStr.length > 0 ? acceptStr.split(',').map(Number) : null;
        let reject = rejectStr && rejectStr.length > 0 ? rejectStr.split(',').map(Number) : null;
        let fillter = new ECSFilter(this, accept, reject);
        this._filters.set(fillterKey, fillter);
        // 将当期的entity放入fillter
        for(let i=1; i<this._entityToComponents.length; i++) {
            if(fillter.isAccept(i)) {
                fillter.onEntityEnter(i);
            }
        }
        return fillter;
    }

    public update(dt:number) {
        for(let system of this._systems) {
            system.onUpdate(this, dt);
        }
        if(this._entitiesToDelete.size > 0) {
            this._realRemoveEntity();
        }
    }

    private _realRemoveEntity() {
        this._entitiesToDelete.forEach((value) => {
            this.removeAllComponents(value);
            this._entityIdxPools.push(value);
        });
        this._entitiesToDelete.clear();
    }

}

export function GenFillterKey(accepts: ECSComConstructor[], rejects?: ECSComConstructor[]) {
    let acceptTypes: ComType[] = [];
    let rejectTypes: ComType[] = [];

    if(accepts && accepts.length > 0) {
        for(let i = 0; i < accepts.length; i++) {
            acceptTypes[i] = GetComConstructorType(accepts[i]);
        }
    }
    if(rejects && rejects.length > 0) {
        for(let i = 0; i < rejects.length; i++) {
            rejectTypes[i] = GetComConstructorType(rejects[i]);
        }
    }

    if(acceptTypes.length < 0) {
        console.error(`[ECSWorld]: GenFillterKey 必须要有accpters`);
        return "";
    }

    acceptTypes.sort();
    rejectTypes.sort();

    let key = Array.prototype.join.call(acceptTypes, ",");
    if(!rejectTypes || rejectTypes.length <= 0) return key;
    key += '-';
    key += Array.prototype.join.call(rejectTypes, ",");
    return key;
}
