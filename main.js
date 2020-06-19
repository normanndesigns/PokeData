const electron = require('electron')
const path = require('path')

const { app, BrowserWindow } = electron

let win = null
function createWindow () {
  win = new BrowserWindow({ width: 1050, minWidth: 1050, height: 700, minHeight: 700, frame: false, transparent: true, webPreferences: {nodeIntegration: true}})
  win.loadFile(path.join(__dirname, 'public/index.html'))
}
app.on('ready', createWindow)