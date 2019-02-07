const electron = require('electron')
const path = require('path')

const { app, BrowserWindow } = electron

let win = null
function createWindow () {
  win = new BrowserWindow({ width: 1200, minWidth: 400, height: 600, minHeight: 200, frame: false, transparent: true, webPreferences: {nodeIntegration: true}})
  win.loadFile(path.join(__dirname, 'public/index.html'))
  win.webContents.openDevTools()
  
}
app.on('ready', createWindow)