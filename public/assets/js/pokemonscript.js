const {remote} = require('electron'); 
const fs = require('electron').remote.require('fs')
var PokemonFile = fs.readFileSync('public/assets/data/Data.json', 'utf8')
var PokemonData = JSON.parse(PokemonFile);
var url = new URL(window.location.href);
var Getpokemon = url.searchParams.get("pokemon");
var BGcolor = url.searchParams.get("color");
var close = document.getElementById('closeBTN').addEventListener('click', closeWindow)
var minimize = document.getElementById('minimizeBTN').addEventListener('click', minimizeWindow)
var maximize = document.getElementById('maximizeBTN').addEventListener('click', maximizeWindow)
document.getElementById('name').innerHTML = Getpokemon + '<span class"DexID">' + PokemonData[Getpokemon].DexID + '</span>';

function hexToRgb(hex, light) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    r = parseInt(result[1], 16),
    g = parseInt(result[2], 16),
    b = parseInt(result[3], 16)
    if(light == true){
        return result ? {
            r: r = r - 20,
            g: g = g - 20,
            b: b = b - 20
        } : null;
    }else{
        return result ? {
            r: r = r - 50,
            g: g = g - 50,
            b: b = b - 50
        } : null;
    } 
}

toolbarColor = hexToRgb('#' + BGcolor, false)
wrapperColor = hexToRgb('#' + BGcolor, true)

document.getElementById('global-wrapper').style.backgroundColor = "rgb(" + wrapperColor.r + "," + wrapperColor.g + "," + wrapperColor.b + ")";
document.getElementById('toolbar').style.backgroundColor = "rgb(" + toolbarColor.r + "," + toolbarColor.g + "," + toolbarColor.b + ")";

fileExist = __dirname + "/assets/media/" + Getpokemon.toLowerCase() + ".svg";
fs.stat(fileExist, function(err, stat) {
    if(err == null) {
        document.getElementById('pokemonImage').style.backgroundImage = "url(../public/assets/media/" + Getpokemon.toLowerCase() + ".svg)";
    } else if(err.code === 'ENOENT') {
        document.getElementById('pokemonImage').style.backgroundImage = "url('../public/assets/media/" + Getpokemon.toLowerCase() + " (2).png')";
    }
});

window.addEventListener('load', function() {
    SpatialNavigation.init();
    SpatialNavigation.add({
        selector: 'a, .navigate'
    });
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus();
});

function closeWindow(){
    var window = remote.getCurrentWindow();
    window.close();
}
function minimizeWindow(){
    var window = remote.getCurrentWindow();
    window.minimize();
}
function maximizeWindow(){
    var window = remote.getCurrentWindow();
    window.maximize();
}