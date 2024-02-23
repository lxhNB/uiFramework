// import { ComType } from "../lib/Const";
import { ComType } from "../Lib/Const";
import { ECSComponent } from "../Lib/EcsComponent";
// import { ECSComponent } from "../lib/ECSComponent";

@ECSComponent(ComType.ComMoveAble)
export class ComMovable {
    public running = false;
    public speed = 0;
    public points: cc.Vec2[] = [];
    public pointIdx = 0;
    public keepDir = false;
    public speedDirty = false;
}