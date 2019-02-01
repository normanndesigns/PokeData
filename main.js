const electron = require('electron')
const path = require('path')
const { app, BrowserWindow } = electron

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  win = new BrowserWindow({ width: 1200, minWidth: 400, height: 600, minHeight: 200, frame: false, transparent: true })
  win.loadFile(path.join(__dirname, 'public/index.html'))

  //win.webContents.openDevTools()

}
app.on('ready', createWindow)