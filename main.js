const electron = require('electron')
const path = require('path')

const { app, BrowserWindow } = electron

let win = null
function createWindow () {
  win = new BrowserWindow({ width: 800, minWidth: 800, height: 450, minHeight: 450, frame: false, transparent: true, webPreferences: {nodeIntegration: true}})
  win.loadFile(path.join(__dirname, 'public/index.html'))
  //win.webContents.openDevTools()
  
}
app.on('ready', createWindow)