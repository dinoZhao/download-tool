let Aria2 = require('aria2')
let child_process = require('child_process')
let path = require('path')
const mineType = require('mime-types');
let fs = require('fs')
let os = require('os')
let portscanner = require('portscanner')
let filesize = require('filesize')
let rpcport, netport;
const spawn = child_process.spawn
let token = 'wwsasada'
const saveSessionInterval = 60

portscanner
  .findAPortNotInUse(18060, 20000)
  .then(port => {
    rpcport = port
    return portscanner.findAPortNotInUse(8060, 9000)
  })
  .then(port => {
    netport = port
    return { netport, rpcport }
  })
  .catch(err => {
    logger.error(new Error('cannot find port'))
    return Promise.reject(err)
  }).then(port => {
    console.log(port)
    let exePath = path.join(path.dirname(__dirname), 'pcdn/pcdn.exe')
    let pcdnProcess = spawn(exePath, ['start'], {})
    if (pcdnProcess.stdout && pcdnProcess.stderr) {
      pcdnProcess.stdout.on('data', data => {
        if(data.toString().match('start ppio user node ok')){
          console.log('启动成功')
        }
      })

      pcdnProcess.stderr.on('data', data => {
        // console.error(data)
        // console.log(data.toString())
      })
    }

  })
