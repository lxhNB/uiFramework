"use strict";const path=require("path"),fs=require("fs"),chokidar=require("chokidar"),{dialog:dialog}=require("electron").remote;function join(t){return path.join(__dirname,"../",t)}const{pbjs:pbjs,pbts:pbts}=require("protobufjs/cli"),pkg=require(join("package.json")),Vue=require(join("libs/vue.min.js")),cachePath=join(".cache.3d.json");fs.existsSync(cachePath)||fs.writeFileSync(cachePath,JSON.stringify({optionCreate:!0,optionLimit:!0,optionVerify:!0,watchUpdate:!1,filter:"\\.proto$",fileName:"",input:null,output:null},null,4)),require("fix-path")();let vm,panel,running,watcher,cache=require(cachePath);function openDir(t){return Editor.Dialog.showOpenDialog({defaultPath:t,properties:["openDirectory"]})}function readProto(t,e,o){const r=fs.readdirSync(e);for(let i=0;i<r.length;i++){const n=path.join(e,r[i]);fs.statSync(path.join(e,r[i])).isDirectory()?readProto(t,n,o):t.test(n)&&o.push(n)}}function dbPath(t){return/^db/.test(t)?t:"db:/"+t.slice(Editor.Project.path.length).replace(/\\/g,"/")}function compileProto(t,e){return new Promise((o,r)=>{pbjs.main(["--force-number","-t","static","-r","creator","-w","commonjs"].concat(t),(t,i)=>{if(t)return r(t);writeFileToProject(e,i.replace(/\$protobuf/g,"protobuf").replace("protobuf.roots.creator = {}","protobuf.roots.creator = $util.global"),o)})})}function generateTsd(t){const e=t.replace(".js",".d.ts");return new Promise((o,r)=>{process.execPath="node",pbts.main(["-m",t],(t,i)=>{if(t)return r(t);writeFileToProject(e,`declare global {\n ${i} \n}\nexport {}`,o)})})}function copyProtojs(t){return new Promise((e,o)=>{const r=fs.readFileSync(join("node_modules/protobufjs/dist/minimal/protobuf.min.js"));writeFileToProject(`${t}/protobuf.min.js`,r,o=>{const r=fs.readFileSync(join("node_modules/protobufjs/index.d.ts"));writeFileToProject(`${t}/protobuf.d.ts`,r,t=>e(o))})})}async function writeFileToProject(t,e,o){const r=dbPath(t);let i;if(fs.existsSync(t)){const o=fs.readFileSync(`${t}.meta`);i=JSON.parse(o).uuid,await Editor.Message.request("asset-db","save-asset",i,e)}else i=await Editor.Message.request("asset-db","create-asset",r,e);o(i)}Editor.T=Editor.I18n.t,Editor.warn=console.warn,Editor.log=console.log,Editor.error=console.error,Editor.Dialog.showOpenDialog=dialog.showOpenDialog,exports.style=fs.readFileSync(join("panel/panel.3d.css")),exports.template=fs.readFileSync(join("panel/panel.3d.html")),exports.$={root:"#root"},exports.close=function(){if(!vm)return;let t=!1;for(const e in cache)Object.hasOwnProperty.call(vm.$data,e)&&(cache[e]=vm.$data[e],t=!0);t&&fs.writeFileSync(cachePath,JSON.stringify(cache,null,4))},exports.ready=function(){vm=new Vue({el:(panel=this).$.root,data:{input:cache.input||"",output:cache.output||path.join(Editor.Project.path,"assets"),fileName:cache.fileName||path.basename(Editor.Project.path),optionCreate:cache.optionCreate,optionLimit:cache.optionLimit,optionVerify:cache.optionVerify,watchUpdate:cache.watchUpdate,filter:cache.filter||"\\.proto$"},created:function(){this.$nextTick(()=>{for(const t in vm.$data)Object.hasOwnProperty.call(vm.$refs,t)&&(vm.$refs[t].value=vm.$data[t])})},methods:{t:t=>Editor.T(`${pkg.name}.${t}`),selectDirImport(){if(running)return Editor.warn(this.t("executeWarn"));const t=openDir(path.join(Editor.Project.path,"assets"));if(!t||0===t.length)return Editor.warn(this.t("form.warnInput"));this.output=t[0],running=!0,copyProtojs(this.output).then(()=>Editor.log(this.t("executeSuccess"))).catch(t=>Editor.error(t)).finally(()=>running=!1)},selectInputDir(){const t=openDir(Editor.Project.path);t&&0!==t.length&&(this.input=t[0])},onChange(t){Object.hasOwnProperty.call(this,t)&&(this[t]=this.$refs[t].value)},onCheckbox(t){Object.hasOwnProperty.call(this,t)&&(this[t]=!this[t])},execute(){if(running)return Editor.warn(this.t("executeWarn"));if(""===this.output)return Editor.warn(this.t("form.warnOutput"));if(""===this.input||""===this.fileName||""===this.filter)return Editor.warn(this.t("form.warnInput"));let t=["--no-beautify"];this.optionCreate&&(t.push("--no-create"),t.push("--no-convert")),this.optionVerify&&t.push("--no-verify"),this.optionLimit&&t.push("--no-delimited");const e=new RegExp(this.filter);readProto(e,this.input,t);const o=path.join(this.output,`protobuf+${this.fileName}.js`);this.watchUpdate&&!watcher&&((watcher=chokidar.watch(this.input,{ignored:/\.proto{0}$/})).on("unlink",r=>{e.test(r)&&(Editor.log(this.t("deleteFile"),r),t.splice(t.indexOf(r),1),this._createFiles(t,o))}),watcher.on("change",r=>{e.test(r)&&(Editor.log(this.t("changeFile"),r),-1===t.indexOf(r)&&t.push(r),this._createFiles(t,o))})),this._createFiles(t,o)},_createFiles(t,e){if(running=!0,e=e.replace(/\+/g,""),!/\.proto$/.test(t[t.length-1]))return[e,e.replace(".js",".d.ts")].forEach(t=>{fs.unlinkSync(t)}),running=!1,Editor.warn(this.t("form.warnFilter"));compileProto(t,e).then(generateTsd(e)).then(()=>Editor.log(this.t("executeSuccess"))).catch(t=>Editor.error(t.message)).finally(()=>running=!1)}}})};