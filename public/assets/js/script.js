const {remote} = require('electron'); 
const fs = require('electron').remote.require('fs')
const path = require('electron').remote.require('path')
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
        selector: 'li, .navigate'
    });
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus();
});

fs.readdir(__dirname + "/assets/media/", (err, files) => {
    for(i = 0; i < files.length; i++){
        createListEntry("../public/assets/media/" + files[i], document.getElementById('mainWrapper'), files[i])
    }
})

document.getElementById('searchBTN').addEventListener('click', () => {
    emptySearch()
    FlexNone('hide', document.getElementById('pokemonImage'))
    FlexNone('hide', document.getElementById('mainWrapper'), 'pokedex-wrapper')
    FlexNone('show', document.getElementById('searchWrapper'), 'search-wrapper')
})
document.getElementById('pokedexBTN').addEventListener('click', () => {
    emptySearch()
    FlexNone('hide', document.getElementById('pokemonImage'))
    FlexNone('hide', document.getElementById('searchWrapper'), 'search-wrapper')
    FlexNone('show', document.getElementById('mainWrapper'), 'pokedex-wrapper')
})

document.getElementById('searchResults').addEventListener('click', (e) => {
    if(e.target !== document.getElementById('searchResults')){
        if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
            document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.childNodes[3].innerHTML]['Color'][0];
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[3].innerHTML + '.png)'
            FlexNone('show', document.getElementById('pokemonImage'))
            FlexNone('hide', document.getElementById('searchWrapper'), 'search-wrapper')
        }
    }
})

document.getElementById('backBTN').addEventListener('click', () => {
    emptySearch()
    FlexNone('hide', document.getElementById('pokemonImage'))
    FlexNone('show', document.getElementById('searchWrapper'), 'search-wrapper')
})

function FlexNone(display, object, extraClasses = ""){
    if(display == 'hide'){
        object.className = 'none ' + extraClasses;
    }else if(display == 'show'){
        object.className = 'flex ' + extraClasses;
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

function createListEntry(src, dom, file){
    div = document.createElement("div");
    div.className = 'pokemon'
    image = document.createElement("img");
    image.src = src;
    text = document.createElement('p');
    text.innerHTML = removeExtension(file);
    div.appendChild(image)
    div.appendChild(text)
    dom.appendChild(div)
}

function removeExtension(file){
    return file.split('.')[0]
}

function emptySearch(){
    document.getElementById('search').value = "";
    search();
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
            document.getElementById('imageresult' + i).src = "assets/media/" + tempArray[i - 1] + ".png"
            FlexNone('show', document.getElementById('result' + i))
        }
    }
}
