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
    if(screen.availWidth === window.getSize()[0] && screen.availHeight === window.getSize()[1]){
        //window.setPosition(Position[0], Position[1])
        window.setSize(Size[0], Size[1]);
    }else{
        Position = [window.getPosition[0], window.getPosition[1]]
        Size = [window.getSize()[0], window.getSize()[1]]
        window.maximize();
    }
}

function createListEntry(src, dom, file){
    div = document.createElement("li");
    div.className = 'pokemon navigate'
    image = document.createElement("img");
    image.src = src;
    image.alt = removeExtension(file);
    text = document.createElement('p');
    PokemonNameWOD = file.split('-')[1]
    text.innerHTML = removeExtension(PokemonNameWOD);
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

function ShowHideWrapper(pokemonImage, mainWrapper, searchWrapper){
    FlexNone(pokemonImage, document.getElementById('pokemonImage'))
    FlexNone(mainWrapper, document.getElementById('mainWrapper'), 'pokedex-wrapper')
    FlexNone(searchWrapper, document.getElementById('searchWrapper'), 'search-wrapper')
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
            document.getElementById('Showresult' + i).innerHTML = tempArray[i - 1];
            document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]].DexID.replace('#','') + "-" + tempArray[i - 1] + ".png";
            document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]].DexID.replace('#','') + "-" + tempArray[i - 1];
            FlexNone('show', document.getElementById('result' + i))
        }
    }
}

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
    ShowHideWrapper('hide', 'hide', 'show')
})
document.getElementById('pokedexBTN').addEventListener('click', () => {
    emptySearch()
    ShowHideWrapper('hide', 'show', 'hide')
})

document.getElementById('searchResults').addEventListener('click', (e) => {
    if(e.target !== document.getElementById('searchResults')){
        if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
            if(e.target.tagName === 'DIV'){
                document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][0];
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt + '.png)'
                ShowHideWrapper('show', 'hide', 'hide')
            }else if(e.target.tagName === 'IMG'){
                document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][0];
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt + '.png)'
                ShowHideWrapper('show', 'hide', 'hide')
            }else{
                document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.childNodes[3].innerHTML]['Color'][0];
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt + '.png)'
                ShowHideWrapper('show', 'hide', 'hide')
            }
            
        }
    }
})
document.getElementById('searchResults').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target !== document.getElementById('searchResults')){
            if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
                document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.childNodes[3].innerHTML]['Color'][0];
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt + '.png)'
                ShowHideWrapper('show', 'hide', 'hide')
            }
        }
    }
})

document.getElementById('backBTN').addEventListener('click', () => {
    emptySearch()
    ShowHideWrapper('hide', 'hide', 'show')
})

document.getElementById('mainWrapper').addEventListener('click', (e) => {
    if(e.target.tagName === "LI"){
        document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][0];
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt + '.png)'
        ShowHideWrapper('show', 'hide', 'hide')
    }
    else if(e.target.tagName === "IMG"){
        document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][0];
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + '.png)';
        ShowHideWrapper('show', 'hide', 'hide')
    }
    else if(e.target.tagName === "P"){
        document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][0];
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + '.png)';
        ShowHideWrapper('show', 'hide', 'hide')
    }
})

document.getElementById('mainWrapper').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target.tagName === "LI"){
            document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][0];
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].innerHTML + '.png)'
            ShowHideWrapper('show', 'hide', 'hide')
        }
    }
})