const {remote} = require('electron'); 
var VibrantModule = require('electron').remote.require('node-vibrant')
var close = document.getElementById('closeBTN').addEventListener('click', closeWindow)
var minimize = document.getElementById('minimizeBTN').addEventListener('click', minimizeWindow)
var maximize = document.getElementById('maximizeBTN').addEventListener('click', maximizeWindow)

var url = new URL(window.location.href);

var Getpokemon = url.searchParams.get("pokemon");

imgPath = __dirname + '/assets/media/' + Getpokemon.toLowerCase() + ' (2).png'
console.log(imgPath)
let color = new VibrantModule(imgPath)
color.getPalette((err, palette) => console.log(palette.Vibrant.hex))

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