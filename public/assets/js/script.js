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
        window.setSize(Size[0], Size[1]);
    }else{
        Position = [window.getPosition[0], window.getPosition[1]]
        Size = [window.getSize()[0], window.getSize()[1]]
        window.maximize();
    }
}
function pokemonType(type){
    switch(type) {
        case "Normal":
          return "#AAA878";
          
        case "Fire":
          return "#F07F31";
          
        case "Water":
          return "#6890F0";
          
        case "Grass":
          return "#78C84F";
          
        case "Electric":
          return "#F8D030";
          
        case "Ice":
          return "#9AD7D8";
          
        case "Fighting":
          return "#C03028";
          
        case "Poison":
          return "#A140A1";
          
        case "Ground":
          return "#E0C069";
          
        case "Flying":
          return "#A98FF0";
          
        case "Psychic":
          return "#F95788";
          
        case "Bug":
          return "#A9B821";
          
        case "Rock":
          return "#B7A038";
          
        case "Ghost":
          return "#705798";
          
        case "Dragon":
          return "#7038F9";
          
        case "Dark":
          return "#715748";
          
        case "Steel":
          return "#B8B8D0";
          
        case "Fairy":
          return "#F7C9E3";
          
        default:
          return "#AAA878";
    }
}

function BaseStatsColors(size){
    if(size <= 25){
        return "#F34444";
    }else if(25 < size && size <= 75){
        return "#FF7F0F";
    }else if(75 < size && size <= 150){
        return "#A0E515";
    }else if(size > 150){
        return "#00C2B8";
    }
}

function createType(dom, type){
    div = document.createElement("div");
    div.style.backgroundColor = pokemonType(type);
    div.innerHTML = type;
    div.className = "Pokemon-type-objects";
    dom.appendChild(div);
}
function createListEntry(src, dom, file){
    li = document.createElement("li");
    li.className = 'pokemon navigate'
    image = document.createElement("img");
    image.src = src;
    image.alt = removeExtension(file);
    text = document.createElement('p');
    PokemonNameWOD = file.split('-')[1]
    text.innerHTML = removeExtension(PokemonNameWOD);
    li.appendChild(image)
    li.appendChild(text)
    dom.appendChild(li)
}
function removeTypes(dom){
    while (dom.hasChildNodes()) {
        dom.removeChild(dom.firstChild);
    }
}
function removeExtension(file){
    return file.split('.')[0]
}
function emptySearch(){
    document.getElementById('search').value = "";
    search();
}

function displayPokemonData(pokemonName){
    for(i = 0; i < document.querySelectorAll("#pokemon-name-en, #pokemon-name-jp, .pokemon-stats-wrapper, .stats-titles, .info-names").length; i++){
        document.querySelectorAll("#pokemon-name-en, #pokemon-name-jp, .pokemon-stats-wrapper, .stats-titles, .info-names")[i].style.color = ColorData[pokemonName]['Color'][1];
        if(i <= 5){
            document.querySelectorAll(".pokemon-stats-bar")[i].style.backgroundColor = ColorData[pokemonName]['Color'][1];
        }
    }
    removeTypes(document.getElementById('pokemon-type-wrapper'));
    for(i = 0; i < PokemonData[pokemonName]["Types"][pokemonName].length; i++){
        createType(document.getElementById('pokemon-type-wrapper'), PokemonData[pokemonName]["Types"][pokemonName][i])
    }
    document.getElementById('pokemon-nationalnr').innerHTML = PokemonData[pokemonName]['DexID'];
    document.getElementById('pokemon-species').innerHTML = PokemonData[pokemonName]['Category'];
    document.getElementById('pokemon-height').innerHTML = PokemonData[pokemonName]['Height'][pokemonName].join(", ");
    document.getElementById('pokemon-weight').innerHTML = PokemonData[pokemonName]['Weight'][pokemonName].join(", ");
    pokemonAbilities = PokemonData[pokemonName]['PokemonAbilities'][pokemonName].join(", ");
    document.getElementById('pokemon-abilities').innerHTML = pokemonAbilities.replace('Hidden Ability', "(HA)");

    document.getElementById('pokemon-ev-yield').innerHTML = PokemonData[pokemonName]['EVYeild'].join(", ");
    document.getElementById('pokemon-catch-rate').innerHTML = PokemonData[pokemonName]['CatchRate'];
    document.getElementById('pokemon-base-friendship').innerHTML = PokemonData[pokemonName]['BaseFriendship'];

    document.getElementById('pokemon-name-en').innerHTML = pokemonName;
    document.getElementById('pokemon-name-jp').innerHTML = PokemonData[pokemonName].NameJP;
    document.getElementById('HP-stat').innerHTML = PokemonData[pokemonName]['Base stats'].HP[0];
    document.getElementById('Attack-stat').innerHTML = PokemonData[pokemonName]['Base stats'].Attack[0];
    document.getElementById('Defense-stat').innerHTML = PokemonData[pokemonName]['Base stats'].Defense[0];
    document.getElementById('SpATK-stat').innerHTML = PokemonData[pokemonName]['Base stats'].SpAttack[0];
    document.getElementById('SpDEF-stat').innerHTML = PokemonData[pokemonName]['Base stats'].SpDefense[0];
    document.getElementById('Speed-stat').innerHTML = PokemonData[pokemonName]['Base stats'].Speed[0];
        
    document.getElementById('pokemon-stats-progress-HP').setAttribute("style", "width:" + ((PokemonData[pokemonName]['Base stats'].HP[0] <= 20) ? "20px;"  : PokemonData[pokemonName]['Base stats'].HP[0] + "px;") + "background-color:" + BaseStatsColors(PokemonData[pokemonName]['Base stats'].HP[0]));
    document.getElementById('pokemon-stats-progress-Attack').setAttribute("style", "width:" + ((PokemonData[pokemonName]['Base stats'].Attack[0] <= 20) ? "20px;"  : PokemonData[pokemonName]['Base stats'].Attack[0] + "px;") + "background-color:" + BaseStatsColors(PokemonData[pokemonName]['Base stats'].Attack[0]));
    document.getElementById('pokemon-stats-progress-Defense').setAttribute("style", "width:" + ((PokemonData[pokemonName]['Base stats'].Defense[0] <= 20) ? "20px;"  : PokemonData[pokemonName]['Base stats'].Defense[0] + "px;") + "background-color:" + BaseStatsColors(PokemonData[pokemonName]['Base stats'].Defense[0]));
    document.getElementById('pokemon-stats-progress-SpAttack').setAttribute("style", "width:" + ((PokemonData[pokemonName]['Base stats'].SpAttack[0] <= 20) ? "20px;"  : PokemonData[pokemonName]['Base stats'].SpAttack[0] + "px;") + "background-color:" + BaseStatsColors(PokemonData[pokemonName]['Base stats'].SpAttack[0]));
    document.getElementById('pokemon-stats-progress-SpDefense').setAttribute("style", "width:" + ((PokemonData[pokemonName]['Base stats'].SpDefense[0] <= 20) ? "20px;"  : PokemonData[pokemonName]['Base stats'].SpDefense[0] + "px;") + "background-color:" + BaseStatsColors(PokemonData[pokemonName]['Base stats'].SpDefense[0]));
    document.getElementById('pokemon-stats-progress-Speed').setAttribute("style", "width:" + ((PokemonData[pokemonName]['Base stats'].Speed[0] <= 20) ? "20px;"  : PokemonData[pokemonName]['Base stats'].Speed[0] + "px;") + "background-color:" + BaseStatsColors(PokemonData[pokemonName]['Base stats'].Speed[0]));
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
                displayPokemonData(e.target.parentNode.childNodes[3].innerHTML)
                document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][0];
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt + '.png)';
                ShowHideWrapper('show', 'hide', 'hide')
            }else if(e.target.tagName === 'IMG'){
                displayPokemonData(e.target.parentNode.childNodes[3].innerHTML);
                document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][0];
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt + '.png)'
                ShowHideWrapper('show', 'hide', 'hide')
            }else{
                displayPokemonData(e.target.childNodes[3].innerHTML)
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
                displayPokemonData(e.target.childNodes[3].innerHTML)
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
        displayPokemonData(e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1))
        document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][0];
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt + '.png)'
        ShowHideWrapper('show', 'hide', 'hide')
    }
    else if(e.target.tagName === "IMG"){
        displayPokemonData(e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1))
        document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][0];
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + '.png)';
        ShowHideWrapper('show', 'hide', 'hide')
    }
    else if(e.target.tagName === "P"){
        displayPokemonData(e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1))
        document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][0];
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + '.png)';
        ShowHideWrapper('show', 'hide', 'hide')
    }
})

document.getElementById('mainWrapper').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target.tagName === "LI"){
            displayPokemonData(e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1))
            document.getElementById('pokemonImage').style.backgroundColor = ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][0];
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].innerHTML + '.png)'
            ShowHideWrapper('show', 'hide', 'hide')
        }
    }
})