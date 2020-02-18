let Aria2 = require('aria2')
let child_process = require('child_process')
let path = require('path')
const mineType = require('mime-types');
let fs = require('fs')
let aria2, gid;
const spawn = child_process.spawn
    const cmdArgs = [
      '--conf-path=./aria2c.conf',
    ]
    let exePath = path.join(path.dirname(__dirname), 'aria2/aria2c.exe')
    let aria2cProcess = spawn(exePath, cmdArgs, {})
    if (aria2cProcess.stdout && aria2cProcess.stderr) {
      aria2cProcess.stdout.on('data', res => {
        if (res.toString().match('IPv4 RPC')) {
          aria2 = new Aria2({
            host: '127.0.0.1',
            port: 6800,
            secure: false,
            path: '/jsonrpc',
          })
          // downloadFile("http://bigspeed.onlinedown.net/down/pscc2017.zip")
          //  downloadFile("magnet:?xt=urn:btih:f89a4508271b4d54456dd5b7d867c80dfe95bf2d")
          // downloadFile("magnet:?xt=urn:btih:F9407F1A0B00B66CB4EAFB559455E9F21A0B053A")
          //   downloadFile("", true)
          // aria2
          //   .open()
          //   .then(() => console.log("open"))
          //   .catch(err => console.log("error", err));
         
        }
      })
    }
function downloadFile(url, istorrent) {
  if (istorrent) {
    console.log('下载种子')
    aria2.call("addTorrent", getBase64('E:\\code\\download-tool\\aria2\\download\\serious.torrent'), []).then(res => {
      console.log('gid:' + res);
      gid = res;
      aria2.call('getOption', gid).then(res => {
      }).catch(err => console.error(err))
      aria2.call('getFiles', gid).then(res => { console.log('list'); console.log(res) }).catch(err => console.error(err))
    }).catch(err => {
      console.error('err' + err)
    });
  } else {
    aria2.call("addUri", [url]).then(res => {
      console.log(res);
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