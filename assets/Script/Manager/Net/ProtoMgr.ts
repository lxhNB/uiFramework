// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// import { CommonUtil } from "./CommonUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ProtoMgr extends cc.Component {

    @property({
    type: cc.TextAsset,
    // displayName: "",
    tooltip: "proto",
    })
    userProto: cc.TextAsset = null;

    private pb = null;
    

    onLoad () {
        this.pb = protobuf.parse(this.userProto)
        console.log('pb',this.pb, this.pb.root)

        // let buf = this.serializeMsg("UserModel",{"cyUserno":"12","cyPassWord":"22","cyStatus":"33"})
        // console.log('buf',buf)
        // //反序列
        // let enBuf = this.deSerializeMsg("UserModel",buf)
        // console.log('反序列',enBuf)

        this.decodeMsg(3,3)


        // let txt = "联系李老师"
        // txt
        // CommonUtil.instance().print()
    }

    //序列化
    public serializeMsg(msgName,msgBody): Uint8Array
    {
        // //获得消息的类型
        // let rs = this.pb.root.lookupType(msgName)
        // //创建对象
        // let msg = rs.create(msgBody);
        // // //编码协议
        // let buf = rs.encode(msg).finish();
        // return buf
        let a= new Object();
        // a.lookupType("a")
        let rs = this.pb.root.lookupType(msgName);
        console.log('rs',rs)
        let msg = rs.create(msgBody);
        let buf = rs.encode(msg).finish();

        return buf;

    }
    //反序列化
    deSerializeMsg(msgName,msgBuf:Uint8Array)
    {
        let rs = this.pb.root.lookupType(msgName)
        let msg = rs.decode(msgBuf)
        return msg

    }

    start () {
        // let msg:MessageBase
        

    }
    //压包
    decodeMsg(sType,cType)
    {
        //先将需要传输的对象数据， 序列化
        let msgBuff:Uint8Array = this.serializeMsg("UserModel",{"cyUserno":"12","cyPassWord":"22","cyStatus":"33"})
        if(!msgBuff) return;
        //注入长度  自定义  stype 服务器号2字节  和 ctype 客户端2字节 ，预留四个字节
        let totalLength =  msgBuff.length + 2 + 2 + 4;
        // 新建一个buff(内存中的一段地址，可理解为一个容器)只可修改数据，不可修改长度
        let buf:ArrayBuffer = new ArrayBuffer(totalLength);

        // 、、借助dataView,读写buff里面数据，操作内存中的接口
        let dataView = new DataView(buf);
        dataView.setInt16(0,sType,true)
        dataView.setInt16(2,cType,true)
        dataView.setInt32(4,0,true)

        //buff写到最开始buff

        let uIntBuff = new Uint8Array(buf)
        //接口set
        //从第八个位置开始
        uIntBuff.set(msgBuff,8);

        //最后调用websocket发送buf
        // send（buf）
        console.log('压包数据',buf)
        this.enCodemsg(buf)

    }
    //解包
    enCodemsg(buf:ArrayBuffer)
    {
        //新建一个dataView
        let dataView = new DataView(buf);
        //读取sType
        let sType = dataView.getInt16(0,true);
        let cType = dataView.getInt16(2,true);//可用于获得包名

        //读取出来msgBuff
        let uIntBuff = new Uint8Array(buf)
        uIntBuff = uIntBuff.subarray(2+2+4)//第八个开始取

        let getData = this.deSerializeMsg("UserModel",uIntBuff)
        console.log('j解包数据',getData)
        //派送

    }

    // update (dt) {}
}
