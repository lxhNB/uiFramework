// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onClick()
    {
        let canvas =  wx.createCanvas()
        // 功能描述
        canvas.toTempFilePath({
            x: 10,
            y: 10,
            width: 200,
            height: 150,
            destWidth: 400,
            destHeight: 300,
            success: (res) => {
              wx.shareAppMessage({
                imageUrl: res.tempFilePath
              })
            }
          })
    }
    // update (dt) {}
}
