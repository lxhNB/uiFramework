const fs = require('fs');
const path = require('path');

const _etcSettings = {
    "android": {
        "formats": [
          {
            "name": "etc1",
            "quality": "slow"
          }
        ]
      },
      "ios": {
        "formats": [
          {
            "name": "etc2",
            "quality": "slow"
          }
        ]
      }
};
// 0 1 分别为nodejs的exe绝对路径  当前js文件所在绝对路径
let sourcePath = process.argv[2]; //项目路径 自己传进来
let isCompress = parseInt(process.argv[3]);//字符串  命令传进来的
// console.log('打印文件',process)
console.log("当前目录的全路径",__dirname) // 当前目录的全路径 E:\cocosProject\uiFramework2

let lookupDir = function(url) {
    if (!fs.existsSync(url)) {
        return;
    }
    fs.readdir(url, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        files.forEach((file) => {
            // console.log("打印每个文件的字符串",file)   //只是文件名加后缀
            let curPath = path.join(url, file);
            // fs.stat(curPath, (err, stats) => {
            // });
            let stat = fs.statSync(curPath); //返回文件信息状态的实例
            if (stat.isDirectory()) { //判断当前文件是不是目录
                lookupDir(curPath); // 遍历目录
            } else {
                if (file.indexOf('.meta') >= 0) {
                    fs.readFile(curPath, (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let obj = JSON.parse(data);
                        console.log('遍历到的meta文件对应的data',data,obj)
                        if (obj && obj.platformSettings) {
                            obj.platformSettings = isCompress ? _etcSettings : {}; // 设置压缩纹理
                            let wrdata = JSON.stringify(obj, null, 2);
                            fs.writeFile(curPath, wrdata, (err) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                            });
                        }
                    });
                }
            }
        });
    });
}

if (!path.isAbsolute(sourcePath)) {
    sourcePath = path.join(__dirname, sourcePath)
}
lookupDir(sourcePath);