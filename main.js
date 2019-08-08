const electron = require('electron')
const path = require('path')

const { app, BrowserWindow } = electron

let win = null
function createWindow () {
  win = new BrowserWindow({ width: 860, minWidth: 860, height: 650, minHeight: 450, frame: false, transparent: true, webPreferences: {nodeIntegration: true}})
  win.loadFile(path.join(__dirname, 'public/index.html'))
}
app.on('ready', createWindow)