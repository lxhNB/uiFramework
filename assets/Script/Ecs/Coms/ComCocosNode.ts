// import { EventBase } from "../../Struct/NodeEvent";
// import { ComType } from "../lib/Const";
// import { ECSComponent } from "../lib/ECSComponent";

import { ComType } from "../Lib/Const";
import { ECSComponent } from "../Lib/EcsComponent";

@ECSComponent(ComType.ComCocosNode)
export class ComCocosNode {
    public node: cc.Node = null;
    public loaded = false;
    public events: any[] = [];
}