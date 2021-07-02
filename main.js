const electron = require('electron')
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
var PokedexPromiseV2 = require('pokedex-promise-v2');
var Pokedex = new PokedexPromiseV2();

const { app, BrowserWindow, screen } = electron
const { ipcMain } = require('electron')

let PreviousWindowInfo = {};
let win = null
function createWindow () {
  const ScreenWidth = screen.getPrimaryDisplay().workAreaSize.width
  const ScreenHeight = screen.getPrimaryDisplay().workAreaSize.height

  TempPokedexWidth = (((ScreenWidth * 0.625)-50)/230)
  if(TempPokedexWidth %= 0){
    PokedexWidth = (((ScreenWidth * 0.625)-50)/230);
  }else{
      PokedexWidth = (230*(Math.round(((ScreenWidth*0.625)-50)/230)))+50;
  }

  TempPokedexHeight = (((ScreenHeight * 0.75)-220)/146)
  if(TempPokedexHeight %= 0){
    PokedexHeight = (((ScreenHeight * 0.75)-220)/146)
  }else{
    PokedexHeight = (146*(Math.round((((ScreenHeight * 0.75)-220)/146))))+220;
  }

  win = new BrowserWindow({ width: PokedexWidth, minWidth: PokedexWidth, height: PokedexHeight, minHeight: PokedexHeight, frame: false, transparent: true, webPreferences: {nodeIntegration: true, enableRemoteModule: true, contextIsolation: false}})
  win.loadFile(path.join(__dirname, 'public/index.html'))
  PreviousWindowInfo = {width: PokedexWidth, height: PokedexHeight, x: win.getNormalBounds().x, y: win.getNormalBounds().y}
}
app.on('ready', createWindow)

ipcMain.on('CloseWindow', async (event) => {
  win.close();
})

ipcMain.on('MinimizeWindow', async (event) => {
  win.minimize();
})

ipcMain.on('MaximizeWindow', async (event) => {
  let [CurrentWidth, CurrentHeight] = win.getSize();
  if(screen.getPrimaryDisplay().workAreaSize.width !=  CurrentWidth && screen.getPrimaryDisplay().workAreaSize.height !=  CurrentHeight){
    PreviousWindowInfo = {width: CurrentWidth, height: CurrentHeight, x: win.getNormalBounds().x, y: win.getNormalBounds().y}
    win.maximize();
  }else{
    win.setBounds({ x: PreviousWindowInfo.x, y: PreviousWindowInfo.y, width: PreviousWindowInfo.width, height: PreviousWindowInfo.height })
    win.restore()
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
      ImageFileArray.push(File);
      FileWithoutGenderVariant = File.replace(".png", "").split("-", 1);
      if(File.includes("-MaleVersion") && ImageFileArray[ImageFileArray.length - 2] === "assets/media/gen" + Generation + "/variants/" + FileWithoutGenderVariant[0] + "-FemaleVersion.png"){
          ImageFileArray.pop();
      }
      if(File.includes("-Zen")){
        ImageFileArray.pop();
      }
    });
  });
  event.returnValue = ImageFileArray;
})

ipcMain.on('PokemonData', async (event, arg) => {
  Pokedex.resource(["https://pokeapi.co/api/v2/pokemon/" + arg,"https://pokeapi.co/api/v2/pokemon-species/" + arg])
  .then(function(Response) {
    TypeURLArray = [];
    for (i = 0; i < Response[0].types.length; i++) {
      TypeURLArray.push("https://pokeapi.co/api/v2/type/" + Response[0].types[i].type.name + "/")
    }
    Pokedex.resource(TypeURLArray)
    .then(function(TypeResponse) {
      CombinedResponse = Response.concat([TypeResponse])
      event.reply('PokemonDataReply', CombinedResponse);
    })
    .catch(function(error) {
      event.reply('PokemonDataReply', error);
    });
  })
  .catch(function(error) {
    event.reply('PokemonDataReply', error);
  });
});