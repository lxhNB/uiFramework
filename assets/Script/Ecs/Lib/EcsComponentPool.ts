// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ComPoolIndex } from "./Const";
import { ECSTypeConstructor } from "./EcsComponent";

const { ccclass, property } = cc._decorator;

@ccclass
//管理所有的组件 。通过自增id来管理
export class EcsComponentPool<T>  {
    //定义类型
    private _componentConstruct: ECSTypeConstructor<T>;
    public constructor(comCons: ECSTypeConstructor<T>) {
        this._componentConstruct = comCons;
    }
    private _components: T[] = [];   //components   组件池
    private _reserverIdxs: ComPoolIndex[] = [];   //缓存的组件的下标idx

    public get(idx: ComPoolIndex) {
        return this._components[idx];
    }
    /**分配 */
    public alloc() {
        if (this._reserverIdxs.length > 0) {
            let ret = this._reserverIdxs.pop();
            this._componentConstruct.apply(this._components[ret])
            return ret;
        }
        let newInstance = new this._componentConstruct();
        this._components.push(newInstance);
        return this._components.length - 1;
    }
    /**释放 */
    public free(idx: ComPoolIndex) {
        if (this._reserverIdxs.indexOf(idx) >= 0) return;
        this._reserverIdxs.push(idx);
    }

}
