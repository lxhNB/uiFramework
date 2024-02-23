// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ComType } from "./Const";


export interface ECSComConstructor extends Function {
    new ():any;
}
export interface ECSTypeConstructor<T> extends ECSComConstructor{
    new():T;
}
export function GetComConstructorType<T>(comCons: {prototype: T}): ComType {
    return comCons['__type__'];
}
export function GetComConstructor(comType: ComType) {
    return ComConsMap[comType];
}

/**通过type存取 构造函数 */
const ComConsMap : {[key:number]:ECSComConstructor} = cc.js.createMap();
export function ECSComponent (type:ComType) {
    return function(comObj:ECSComConstructor)
    {
        comObj['__type__'] = type;
        ComConsMap[type] = comObj
    } 
}
