import EcsWorld from "./EcsWorld";

//抽象类
export abstract class EcsSystem  {
    /**连接 */
    public abstract onAdd(world:EcsWorld):void;
    /**断开连接 */
    public abstract onRemove(world:EcsWorld):void;
    /**实体 */
    public abstract onEntityEnter(world:EcsWorld,entity:number):void
    public abstract onEntityLeave(world:EcsWorld,entity:number):void
    /**更新 */
    public abstract onUpdate(world:EcsWorld,dt:number);

    
}
