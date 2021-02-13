const electron = require('electron')
const path = require('path')

const { app, BrowserWindow } = electron

let win = null
function createWindow () {
  win = new BrowserWindow({ width: 1200, minWidth: 1200, height: 765, minHeight: 765, frame: false, transparent: true, webPreferences: {nodeIntegration: true, enableRemoteModule: true}})
  win.loadFile(path.join(__dirname, 'public/index.html'))
}
app.on('ready', createWindow)