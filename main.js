const electron = require('electron')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')

const { app, BrowserWindow, screen } = electron
const { ipcMain } = require('electron')


let win = null
function createWindow () {
  win = new BrowserWindow({ width: 1200, minWidth: 1200, height: 765, minHeight: 765, frame: false, transparent: true, webPreferences: {nodeIntegration: true, enableRemoteModule: true, contextIsolation: false}})
  win.loadFile(path.join(__dirname, 'public/index.html'))
}
app.on('ready', createWindow)


ipcMain.on('CloseWindow', async (event) => {
  win.close();
})

ipcMain.on('MinimizeWindow', async (event) => {
  win.minimize();
})

ipcMain.on('MaximizeWindow', async (event) => {
  if(screen.availWidth === win.getSize()[0] && screen.availHeight === win.getSize()[1]){
    win.setSize(Size[0], Size[1]);
  }else{
      Position = [win.getPosition[0], win.getPosition[1]]
      Size = [win.getSize()[0], win.getSize()[1]]
      win.maximize();
  }
})


ipcMain.on('LoadConfig', (event) => {
  try {
    if (fs.existsSync("public/assets/data/config.json") === false) {
      fs.writeFile('public/assets/data/config.json', '{"Dextype": "regional"}', function (err) {
          if (err) throw err;
          console.log('config.json created!');
          let file = fs.readFileSync('public/assets/data/config.json', 'utf8');
          event.returnValue = file;
      });
    }else{
      let file = fs.readFileSync('public/assets/data/config.json', 'utf8');
      event.returnValue = file;
    }
  } catch(err) {
    console.error(err)
  }
})

ipcMain.on('LoadVariants', (event) => {
  let file = fs.readFileSync('public/assets/data/Variants.json', 'utf8')
  event.returnValue = file;
})

ipcMain.on('LoadPokedex', (event) => {
  let file = fs.readFileSync('public/assets/data/Pokedex.json', 'utf8')
  event.returnValue = file;
})

ipcMain.on('LoadEvolution', (event) => {
  let file = fs.readFileSync('public/assets/data/Evolution.json', 'utf8')
  event.returnValue = file;
})

ipcMain.on('LoadTypeColor', (event) => {
  let file = fs.readFileSync('public/assets/data/TypeColor.json', 'utf8')
  event.returnValue = file;
})

ipcMain.on('LoadRegionalDex', (event) => {
  let file = fs.readFileSync('public/assets/data/RegionalDex.json', 'utf8')
  event.returnValue = file;
})

ipcMain.on('SaveConfig', async (event, arg) => {
  fs.writeFile("public/assets/data/config.json", arg, function(err) {
    if (err) {
        console.log(err);
    }else{
      event.reply('SaveConfigReply', true)
    }
  });
})

ipcMain.on('RestartApp', (event) => {
    app.relaunch();
    app.exit();
})

ipcMain.on('LoadImages', (event) => {
  GenerationsArray = ["1", "2", "3", "4", "5", "6", "7", "8"];
  ImageFileArray = [];
  GenerationsArray.forEach(Generation => {
    fs.readdirSync("public/assets/media/gen" + Generation + "/").forEach(File => {
      ImageFileArray.push("assets/media/gen" + Generation + "/" + File);
      FileWithoutGenderVariant = File.replace(".png", "").split("-", 1);
      if(File.includes("-MaleVersion") && ImageFileArray[ImageFileArray.length - 2] === "assets/media/gen" + Generation + "/" + FileWithoutGenderVariant[0] + "-FemaleVersion.png"){
          ImageFileArray.pop();
      }
    });
  });
  event.returnValue = ImageFileArray;
})

ipcMain.on('LoadImagesVariants', (event) => {
  GenerationsArray = ["1", "2", "3", "4", "5", "6", "7", "8"];
  ImageFileArray = [];
  GenerationsArray.forEach(Generation => {
    fs.readdirSync("public/assets/media/gen" + Generation + "/variants/").forEach(File => {
      ImageFileArray.push("assets/media/gen" + Generation + "/variants/" + File);
      FileWithoutGenderVariant = File.replace(".png", "").split("-", 1);
      if(File.includes("-MaleVersion") && ImageFileArray[ImageFileArray.length - 2] === "assets/media/gen" + Generation + "/variants/" + FileWithoutGenderVariant[0] + "-FemaleVersion.png"){
          ImageFileArray.pop();
      }
    });
  });
  event.returnValue = ImageFileArray;
})

ipcMain.on('PokemonData', async (event, arg) => {
  response = await fetch('https://pokeapi.co/api/v2/pokemon/' + arg)
  obj = await response.json();
  event.reply('PokemonDataReply', obj)
})
