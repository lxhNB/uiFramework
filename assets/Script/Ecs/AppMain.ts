// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ComMovable } from "./Coms/ComMove";
import { SysMoveable } from "./System/SysMoveable";
import WorldView from "./World/WorldView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AppMain extends cc.Component {
    private _world: WorldView = null
    protected onLoad(): void {
        this._world = new WorldView();
        console.log("",this._world )
        //创建一个实体
        let entityNodeNum = this._world.createEntity();

        this._world.addSystem(new SysMoveable());

        let comMovable = this._world.addComponent(entityNodeNum, ComMovable);
        comMovable.pointIdx = -1;
        comMovable.running = false;
    }
    protected update(dt: number): void {
        if (this._world) this._world.update(dt);
    }
}
