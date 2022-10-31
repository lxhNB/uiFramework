import { CommonUtils } from "./Common/Utils/CommonUtils";
import UIMeshTexture from "./UIScript/UIMeshTexture";
import UINavigator from "./UIScript/UINavigator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    
    onLoad() {
        CommonUtils.strReserve("1234")
        
    }

    start () {
        UINavigator.open();
        // UserModel
        // mainPackage
        // UIMeshTexture.open()
    }
    
    onDestroy() {
        
    }
}