// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 增加单例基类的编写
 */
const { ccclass, property } = cc._decorator;

@ccclass
// export default class Singleton {
//     private static _instance: Singleton = null;
//     public static instance() {
//         if (this._instance == null) {
//             //
//             this._instance = new Singleton()
//         }
//         return this._instance;
//         BaseSingleton
//     }
// }
// export class BaseSigleton333 { 
//     static get i() { 
//         if (!this._i) 
//         this._i = new this(); 
//         return this._i; 
//     } 
//     private static _i; 
// }
/**可以继承的单例类 */
export class BaseSingleton {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this)._i) {
            (<any>this)._i = new this();
        }
        return (<any>this)._i;
    }
    private static _i;
}


