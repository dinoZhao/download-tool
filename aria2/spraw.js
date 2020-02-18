let Aria2 = require('aria2')
let child_process = require('child_process')
let path = require('path')
const mineType = require('mime-types');
let fs = require('fs')


const spawn = child_process.spawn
    const cmdArgs = [
      '--conf-path=./aria2c.conf',
    ]
    let exePath = path.join(path.dirname(__dirname), 'aria2/aria2c.exe')
    let aria2Process=spawn(exePath, cmdArgs)
    aria2Process.stdout.on('data', (data) => {
      console.log(5)
      console.log(data.toString());
      if(data.toString().indexOf('IPv4 RPC') > -1){
        let aria2 = new Aria2({
          host: '127.0.0.1',
          port: 6800,
          secure: false,
          // secret: token,
          path: '/jsonrpc',
        })
        aria2
        .open()
        .then(() => console.log("open"))
        .catch(err => console.log("error", err));
        aria2.on('open', () => {
        console.log('aria2 OPEN');
        });
        // aria2.call('addTorrent',getBase64('./88594aaacbde40ef3e2510c47374ec0aa396c08e.torrent'))
      }
    });
    function getBase64(url) {
      let data = fs.readFileSync(url);
      data = Buffer.from(data).toString('base64')
      return data
    }