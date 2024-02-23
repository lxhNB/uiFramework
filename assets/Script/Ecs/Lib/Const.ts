/**实体的下标类型 */
export type EntityIndex = number;
/**组件再池子中的下标 */
export type ComPoolIndex = number;

// 组件类型
export enum ComType {
    ComCocosNode = 0,
    ComMoveAble = 1,
    ComNodeConfig =2,
    ComBehaviorTree = 3,
    ComTransform = 4,
    ComMonitor = 5,
    ComRoleConfig =6,
    ComAttackAble = 7,
    ComBeAttacked = 8,

}