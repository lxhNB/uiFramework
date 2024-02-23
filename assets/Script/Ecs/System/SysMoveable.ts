import { ComCocosNode } from "../Coms/ComCocosNode";
import { ComMovable } from "../Coms/ComMove";
import { ComTransform } from "../Coms/ComTransform";
import { EcsSystem } from "../Lib/EcsSystem";
import EcsWorld, { GenFillterKey } from "../Lib/EcsWorld";
const FILTER_MOVE = GenFillterKey([ComMovable, ComTransform, ComCocosNode]);
export class SysMoveable extends EcsSystem{
    public onAdd(world: EcsWorld): void {
        // throw new Error("Method not implemented.");
    }
    public onRemove(world: EcsWorld): void {
        // throw new Error("Method not implemented.");
    }
    public onEntityEnter(world: EcsWorld, entity: number): void {
        // throw new Error("Method not implemented.");
        // super.onEntityEnter(world,entity)
    }
    public onEntityLeave(world: EcsWorld, entity: number): void {
        // throw new Error("Method not implemented.");
    }
    public onUpdate(world: EcsWorld, dt: number) {
        // throw new Error("Method not implemented.");
        console.log('upodate')
        let key = world.getFilter(FILTER_MOVE)
        console.log('key',key)
        key.walk((entity: number) => {
            console.log("日志")
            return false;
        })
    }

}