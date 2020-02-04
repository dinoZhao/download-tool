let Aria2 = require('aria2')
let child_process = require('child_process')
let path = require('path')
const mineType = require('mime-types');
let fs = require('fs')
let os = require('os')
let portscanner = require('portscanner')
let filesize = require('filesize')
let aria2, gid;
const spawn = child_process.spawn
let token = 'wwsasada'
const saveSessionInterval = 60
const sessionFilePath = path.join(path.dirname(__dirname), 'aria2/enfi-session-file.gz')
const outDir = path.join(path.dirname(__dirname), 'aria2/download')
const btPath=path.join(path.dirname(__dirname), 'aria2/download/ford.torrent')
console.log(btPath)
portscanner
  .findAPortNotInUse(17000, 20000).then(port => {
    // console.log(port)
    const cmdArgs = [
      '--enable-rpc=true',
      // '--pause=true',
      '--pause-metadata=true',
      '--continue=true',
      `--rpc-secret=${token}`,
      `--rpc-listen-port=${port}`,
      // '--bt-metadata-only=true',
      // '--bt-save-metadata=true',
     
      `--dir=${outDir}`,
      // '--bt-tracker=http://tracker.trackerfix.com/announce,http://trackers.ibzu.me/announce.php,http://tracker1.torrentino.com/announce,http://tracker2.torrentino.com/announce',
      // '--bt-remove-unselected-file=true',
      '--force-save=true'
       
    ]
    let exePath = path.join(path.dirname(__dirname), 'aria2/aria2c.exe')
    let aria2cProcess = spawn(exePath, cmdArgs, {})
    // save session
    // cmdArgs.push(`--save-session=${sessionFilePath}`)
    // cmdArgs.push(`--save-session-interval=${saveSessionInterval}`)
    // if (fs.existsSync(sessionFilePath)) {
    //   cmdArgs.push(`--input-file=${sessionFilePath}`)
    // }

    if (aria2cProcess.stdout && aria2cProcess.stderr) {
      aria2cProcess.stdout.on('data', res => {
        console.log(res.toString())
        if (res.toString().match('IPv4 RPC')) {
          aria2 = new Aria2({
            host: '127.0.0.1',
            port: port,
            secure: false,
            secret: token,
            path: '/jsonrpc',
          })
          // downloadFile("https://dldir1.qq.com/weixin/Windows/WeChatSetup.exe")
         // downloadFile("magnet:?xt=urn:btih:f89a4508271b4d54456dd5b7d867c80dfe95bf2d")
          //  downloadFile("magnet:?xt=urn:btih:9BB68A3152C90497AC6C3F30DB13D305D8B40BDB")
          downloadFile("", true)

          aria2
            .open()
            .then(() => console.log("open"))
            .catch(err => console.log("error", err));
          aria2.on('open', () => {
            console.log('aria2 OPEN');
          });
          // emitted when the WebSocket is open.
          let interval = setInterval(() => {
            aria2.call('tellStatus', gid).then(res => {
              let files = res.files[116]
              console.log(`${files.completedLength}/${files.length}`)
              if(res.completedLength===res.totalLength){
                clearInterval(interval)
                aria2.call('pause',gid).then(res=>{ console.log('pause');console.log(res)}).catch(err=>console.error(err))

              }

              //   aria2.call('getOption',gid).then(res=>{ console.log('options');console.log(res);
              // }).catch(err=>console.error(err))
              // aria2.call('getFiles',gid).then(res=>{ console.log('list');console.log(res)}).catch(err=>console.error(err))

            }).catch(err => console.error(err))
          }, 1000);
          // emitted when the WebSocket is closed.
          aria2.on('close', () => {
            console.log('aria2 CLOSE');
          });
          aria2.on("onDownloadPause", (res) => {
            console.log("onDownloadPause", res);
          });
          aria2.on("onDownloadPause", (res) => {
            console.log("onDownloadPause", res);
          });
          aria2.on("onDownloadComplete", (res) => {
            console.log("onDownloadComplete", res);
            clearInterval(interval)
          });
          // aria2.on("output", m => {
          //   console.log("aria2 OUT", m);
          // });
          // aria2.on("input", m => {
          //   console.log("aria2 IN", m);
          // });
        }

      })

    }
  })
function downloadFile(url, istorrent) {
  if (istorrent) {
    console.log('下载种子')
    aria2.call("addTorrent", getBase64('E:\\code\\download-tool\\aria2\\download\\serious.torrent'), []).then(res => {
      console.log('gid:' + res);
      gid = res;
        aria2.call('pause',gid).then(res=>{ console.log('pause');console.log(res)}).catch(err=>console.error(err))

      aria2.call('getOption', gid).then(res => {
       // console.log('options'); console.log(res);
       setTimeout(()=>{
        aria2.call('changeOption', gid, { 'select-file': '117' }).then(res=>{ 
          console.log('changeOption');
            aria2.call('unpause',gid).then(res=>{ console.log('unpause');console.log(res)}).catch(err=>console.error(err))
        }).catch(err=>console.error(err))
       },3000)
      }).catch(err => console.error(err))

      aria2.call('getFiles', gid).then(res => { console.log('list'); console.log(res) }).catch(err => console.error(err))
    }).catch(err => {
      // console.log(bin)
      console.error('err' + err)
    });
  } else {
    aria2.call("addUri", [url], {}).then(res => {
      console.log(res);
      gid = res;
    }).catch(err => {
      console.error(err)
    });
  }

}
function getBase64(url) {
  let filePath = path.resolve(url)
  let data = fs.readFileSync(filePath);
  data = Buffer.from(data).toString('base64')
  let base64 = 'data:' + mineType.lookup(filePath) + ';base64,' + data;
  //  console.log(base64)
  return data
}