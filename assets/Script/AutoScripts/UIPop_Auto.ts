
import ButtonPlus from "./../Common/Components/ButtonPlus"

const {ccclass, property} = cc._decorator;
@ccclass
export default class UIPop_Auto extends cc.Component {
	@property(ButtonPlus)
	Close: ButtonPlus = null;
 
}