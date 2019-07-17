const {remote} = require('electron'); 
const fs = require('electron').remote.require('fs')
var PokemonFile = fs.readFileSync('public/assets/data/Data.json', 'utf8')
var PokemonData = JSON.parse(PokemonFile);
var ColorFile = fs.readFileSync('public/assets/data/ColorData.json', 'utf8')
var ColorData = JSON.parse(ColorFile);

var PokemonDataKeys = Object.keys(PokemonData);
var close = document.getElementById('closeBTN').addEventListener('click', closeWindow)
var minimize = document.getElementById('minimizeBTN').addEventListener('click', minimizeWindow)
var maximize = document.getElementById('maximizeBTN').addEventListener('click', maximizeWindow)
document.getElementById('search').addEventListener('keyup', search)

window.addEventListener('load', function() {
    SpatialNavigation.init();
    SpatialNavigation.add({
        selector: 'a, .navigate'
    });
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus();
});

function FlexNone(display, object){
    if(display == 'hide'){
        object.className = 'none';
    }else if(display == 'show'){
        object.className = 'block';
    }
}   


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

function search(){
    tempArray = []
    searchValue = document.getElementById('search').value
    
    PokemonDataKeys.forEach(function(element, index){
        if(element.includes(searchValue)){
            tempArray.push(element)
        }else if(element.toLowerCase().includes(searchValue)){
            tempArray.push(element)
        }
    })
    tempArray = tempArray.sort()
    for(i = 1; i <= 5; i++){
        if(searchValue.length == 0){
            FlexNone('hide', document.getElementById('result' + i))
        }
        else if(typeof tempArray[i - 1] === 'undefined'){
            FlexNone('hide', document.getElementById('result' + i))
        }else{
            document.getElementById('Showresult' + i).innerHTML = tempArray[i - 1]
            document.getElementById('result' + i).href = "../public/Pokemon.html?pokemon=" + tempArray[i - 1] + "&color=" + ColorData[tempArray[i - 1]]['Color'][0]
            FlexNone('show', document.getElementById('result' + i))
        }
    }
}
