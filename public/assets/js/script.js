const {remote} = require('electron'); 
const fs = require('electron').remote.require('fs')
const fetch = require('node-fetch');
const path = require('electron').remote.require('path')
var PokemonFile = fs.readFileSync('public/assets/data/Pokedex.json', 'utf8')
var PokemonData = JSON.parse(PokemonFile);
var PokemonDataKeys = Object.keys(PokemonData);
var ColorFile = fs.readFileSync('public/assets/data/ColorData.json', 'utf8')
var ColorData = JSON.parse(ColorFile);
var TypeColorFile = fs.readFileSync('public/assets/data/TypeColor.json', 'utf8')
var TypeColorData = JSON.parse(TypeColorFile);
var close = document.getElementById('closeBTN').addEventListener('click', closeWindow)
var minimize = document.getElementById('minimizeBTN').addEventListener('click', minimizeWindow)
var maximize = document.getElementById('maximizeBTN').addEventListener('click', maximizeWindow)
document.getElementById('search').addEventListener('keyup', search)

function RGBtoHex(r,g,b) {
    var hex = r.toString(16);
    red = hex.length == 1 ? "0" + hex : hex;

    var hex = g.toString(16);
    green = hex.length == 1 ? "0" + hex : hex;

    var hex = b.toString(16);
    blue = hex.length == 1 ? "0" + hex : hex;

    return "#" + red + green + blue;
}

function lightOrDark(color) {
    var r, g, b, hsp;
    if (color.match(/^rgb/)) {
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );
    
    if (hsp>127.5) {
        return 'light';
    } 
    else {
        return 'dark';
    }
}

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

function capitalizeFirstLetter(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function createListEntry(src, dom, file){
        var PokemonName = []
        for (var key in PokemonData) {
            if (PokemonData.hasOwnProperty(key)) {
                if(PokemonData[key] == removeExtension(file)){
                    PokemonName.push(capitalizeFirstLetter(key))
                }
            }
        }
        PokemonName.forEach(element => {
            div = document.createElement("li");
            div.className = 'pokemon navigate'
            image = document.createElement("img");
            if(element.includes('Alolan')){
                image.src = src.replace(".png","-Alolan.png");
                image.alt = file.replace(".png","-Alolan.png");;
            }else if(element.includes('Galarian')){
                image.src = src.replace(".png","-Galarian.png");
                image.alt = file.replace(".png","-Galarian.png");;
            }else{
                image.src = src;
                image.alt = file;
            }
            text = document.createElement('p');
            text.innerHTML = element;
            div.appendChild(image)
            div.appendChild(text)
            dom.appendChild(div) 
        });
}

function removeExtension(file){
    tempFile = file.replace(".png", "")
    //outputFile = tempFile.replace('.svg', "")
    //return outputFile
    return tempFile
}

function emptySearch(){
    document.getElementById('search').value = "";
    search();
}

function ShowHideWrapper(pokemonImage, mainWrapper, searchWrapper, circleWrapper){
    FlexNone(pokemonImage, document.getElementById('pokemonImage'))
    FlexNone(mainWrapper, document.getElementById('mainWrapper'), 'pokedex-wrapper')
    FlexNone(searchWrapper, document.getElementById('searchWrapper'), 'search-wrapper')
    FlexNone(circleWrapper, document.getElementById('circle-wrapper'), 'circle-wrapper')
}

function search(){
    tempArray = []
    searchValue = document.getElementById('search').value.toLowerCase()
    PokemonDataKeys.forEach(function(element){
        if(element.startsWith(searchValue)){
            tempArray.push(element)
        }else if(element.toLowerCase().startsWith(searchValue)){
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
            console.log(tempArray[i - 1])
            if(tempArray[i - 1].includes('alolan')){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]] + "-Alolan" +  ".png";
                document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]] + "-Alolan" + '.png';
            }else if(tempArray[i - 1].includes('galarian')){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]] + "-Galarian" + ".png";
                document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]] + "-Galarian" + '.png';
            }
            else{
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]] + ".png";
                document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]] + '.png';
            }
            FlexNone('show', document.getElementById('result' + i))
        }
    }
}

function InsertPokemonData(PokemonName){
    var Variants = {
        "Deoxys": "Normal",
        "Giratina": "Altered",
        "Shaymin": "Land",
        "Basculin": "Red-Striped",
        "Darmanitan": "Standard",
        "Galarian darmanitan": "Standard",
        "Tornadus": "Incarnate",
        "Thundurus": "Incarnate",
        "Landorus": "Incarnate",
        "Keldeo": "Ordinary",
        "Meloetta": "Aria"
    }
    DexID = PokemonData[PokemonName.toLowerCase()]
    PokemonName = PokemonName.replace('.',"").replace(' ',"-")
    if(PokemonName.includes('Alolan')){
        var endpoint = PokemonName.toLowerCase().replace("'","").replace("alolan-","") + "-alola"
    }else if(PokemonName.includes('Galarian')){
        var endpoint = PokemonName.toLowerCase().replace("'","").replace("galarian-","")  + "-galar"
    }else{
        if(!Number(PokemonData[PokemonName.toLowerCase()]) === NaN){
            var endpoint = Number(PokemonData[PokemonName.toLowerCase()])
        }else{
            endpoint = PokemonName.toLowerCase();
        }
    }
    console.log('https://pokeapi.co/api/v2/pokemon/' + endpoint)
    fetch('https://pokeapi.co/api/v2/pokemon/' + endpoint)
    .then(res => res.json())
    .then(data => obj = data)
    .then(() => {
        document.getElementById('name').innerHTML = PokemonName.replace("-"," ");
        document.getElementById('name').style.color = "#000000";
        document.getElementById('DexID').innerHTML = "#" + document.getElementById("pokemonImage").getAttribute("data-dexid").replace(/[^0-9]/g, "");
        document.getElementById('DexID').style.color = TypeColorData[obj["types"][0]["type"]["name"]];
        document.getElementById("st0").style.fill = TypeColorData[obj["types"][0]["type"]["name"]];
        document.getElementById("type-wrapper").innerHTML = "";
        for (i = 0; i < obj["types"].length; i++) {
            var type = document.createElement("div"); 
            var typeIcon = document.createElement("div"); 
            var TypeIconImage = document.createElement("img"); 
            var typeName = document.createElement("span"); 

            type.className = "type"
            typeIcon.className = "type-icon";
            typeName.className = "type-name";
            TypeIconImage.src = "../public/assets/static/" + capitalizeFirstLetter(obj["types"][i]["type"]["name"]) + ".svg"

            type.appendChild(typeIcon)
            typeIcon.appendChild(TypeIconImage)
            type.appendChild(typeName)
            
            document.getElementById("type-wrapper").appendChild(type)
              
            typeIcon.style.backgroundColor = TypeColorData[obj["types"][i]["type"]["name"]];
            typeName.innerHTML = capitalizeFirstLetter(obj["types"][i]["type"]["name"]);

            var stats = ["HP", "Attack", "Defense", "Special-Attack", "Special-Defense", "Speed"];
            for(i = 0; i < stats.length; i++){
                if(stats[i] === "HP"){
                    document.getElementById(stats[i] + "-stat").innerHTML = obj["stats"][0]['base_stat'];
                    document.getElementById(stats[i] + "-min-stat").innerHTML = Math.floor(0.01 * (2 * obj["stats"][0]['base_stat'] + 0 + Math.floor(0.25 * 0)) * 100) + 100 + 10;
                    document.getElementById(stats[i] + "-max-stat").innerHTML = Math.floor(obj["stats"][0]['base_stat'] * 2 + 204);
                    if(((obj["stats"][0]['base_stat']/255)*100) <= 33){
                        document.getElementById(stats[i] + "-stat-bar").className = "progress stats-red";
                        document.getElementById(stats[i] + "-stat-bar").style.width = ((obj["stats"][0]['base_stat']/255)*100) + "%";
                    }else if(((obj["stats"][0]['base_stat']/255)*100) >= 33 && ((obj["stats"][0]['base_stat']/255)*100) <= 66){
                        document.getElementById(stats[i] + "-stat-bar").className = "progress stats-yellow";
                        document.getElementById(stats[i] + "-stat-bar").style.width = ((obj["stats"][0]['base_stat']/255)*100) + "%";
                    }else if(((obj["stats"][0]['base_stat']/255)*100) > 66){
                        document.getElementById(stats[i] + "-stat-bar").className = "progress stats-green";
                        document.getElementById(stats[i] + "-stat-bar").style.width = ((obj["stats"][0]['base_stat']/255)*100) + "%";
                    }
                }else{
                    document.getElementById(stats[i] + "-stat").innerHTML = obj["stats"][i]['base_stat']
                    document.getElementById(stats[i] + "-min-stat").innerHTML =  Math.floor(((0.01 * (2 * obj["stats"][i]['base_stat'] + 0 + Math.floor(0.25 * 0)) * 100) + 5) * 0.9);
                    document.getElementById(stats[i] + "-max-stat").innerHTML = Math.floor((obj["stats"][i]['base_stat']*2+5+31+63)*1.1);    
                    if(((obj["stats"][i]['base_stat']/255)*100) <= 33){
                        document.getElementById(stats[i] + "-stat-bar").className = "progress stats-red";
                        document.getElementById(stats[i] + "-stat-bar").style.width = ((obj["stats"][i]['base_stat']/255)*100) + "%";
                    }else if(((obj["stats"][i]['base_stat']/255)*100) >= 33 && ((obj["stats"][i]['base_stat']/255)*100) <= 66){
                        document.getElementById(stats[i] + "-stat-bar").className = "progress stats-yellow";
                        document.getElementById(stats[i] + "-stat-bar").style.width = ((obj["stats"][i]['base_stat']/255)*100) + "%";
                    }else if(((obj["stats"][i]['base_stat']/255)*100) > 66){
                        document.getElementById(stats[i] + "-stat-bar").className = "progress stats-green";
                        document.getElementById(stats[i] + "-stat-bar").style.width = ((obj["stats"][i]['base_stat']/255)*100) + "%";
                    }
                }
            }
            document.getElementById("Total-stat").innerHTML = obj["stats"][0]['base_stat'] + obj["stats"][1]['base_stat'] + obj["stats"][2]['base_stat'] + obj["stats"][3]['base_stat'] + obj["stats"][4]['base_stat'] + obj["stats"][5]['base_stat']
        }
    })
    .catch(() => {
        if(Variants[PokemonName] != undefined){
            InsertPokemonData(PokemonName + " " + Variants[PokemonName])
        }
    });
    document.getElementById("st0").style.fill = "#fff";
}

window.addEventListener('load', function() {
    SpatialNavigation.init();
    SpatialNavigation.add({
        selector: 'li, .navigate'
    });
    SpatialNavigation.makeFocusable();
});

fs.readdir(__dirname + "/assets/media/", (err, files) => {
    for(i = 0; i < files.length; i++){
        tempImageFileArray = files[i].split('-');
        if(!files[i].includes('-')){
            createListEntry("../public/assets/media/" + files[i], document.getElementById('mainWrapper'), files[i])
        }
    }
})

document.getElementById('searchBTN').addEventListener('click', () => {
    emptySearch()
    ShowHideWrapper('hide', 'hide', 'show', 'hide')
})
document.getElementById('pokedexBTN').addEventListener('click', () => {
    emptySearch()
    ShowHideWrapper('hide', 'show', 'hide', 'hide')
})
document.getElementById('backBTN').addEventListener('click', () => {
    emptySearch()
    ShowHideWrapper('hide', 'hide', 'show', 'hide')
})

document.getElementById('searchResults').addEventListener('click', (e) => {
    if(e.target !== document.getElementById('searchResults')){
        if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
            if(e.target.tagName === 'DIV'){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt + ')';
                document.getElementById('pokemonImage').dataset.dexid = e.target.parentNode.childNodes[1].alt.replace(".png", "");
                InsertPokemonData(capitalizeFirstLetter(e.target.parentNode.childNodes[3].innerHTML));
                ShowHideWrapper('show', 'hide', 'hide', 'show');
            }else if(e.target.tagName === 'IMG'){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt + ')';
                document.getElementById('pokemonImage').dataset.dexid = e.target.alt.replace(".png", "");
                InsertPokemonData(capitalizeFirstLetter(e.target.parentNode.childNodes[3].innerHTML));
                ShowHideWrapper('show', 'hide', 'hide', 'show');
            }else{
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt + ')';
                document.getElementById('pokemonImage').dataset.dexid = e.target.childNodes[1].alt.replace(".png", "");
                InsertPokemonData(capitalizeFirstLetter(e.target.childNodes[3].innerHTML));
                ShowHideWrapper('show', 'hide', 'hide', 'show');
            }
            
        }
    }
})

document.getElementById('searchResults').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target !== document.getElementById('searchResults')){
            if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt + ')';
                document.getElementById('pokemonImage').dataset.dexid = e.target.childNodes[1].alt.replace(".png", "");
                InsertPokemonData(capitalizeFirstLetter(e.target.childNodes[3].innerHTML));
                ShowHideWrapper('show', 'hide', 'hide', 'show');
            }
        }
    }
})

document.getElementById('mainWrapper').addEventListener('click', (e) => {
    if(e.target.tagName === "LI"){
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt + ')';
        document.getElementById('pokemonImage').dataset.dexid = e.target.childNodes[0].alt;
        InsertPokemonData(e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1));
        ShowHideWrapper('show', 'hide', 'hide', 'show');
    }
    else if(e.target.tagName === "IMG"){
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + ')';
        document.getElementById('pokemonImage').dataset.dexid = e.target.parentNode.childNodes[0].alt;
        InsertPokemonData(e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1));
        ShowHideWrapper('show', 'hide', 'hide', 'show');
    }
    else if(e.target.tagName === "P"){
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + ')';
        document.getElementById('pokemonImage').dataset.dexid = e.target.parentNode.childNodes[0].alt;
        InsertPokemonData(e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1));
        ShowHideWrapper('show', 'hide', 'hide', 'show')
    }
})
document.getElementById('mainWrapper').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target.tagName === "LI"){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt + ')';
            document.getElementById('pokemonImage').dataset.dexid = e.target.childNodes[0].alt.replace(".png", "");
            InsertPokemonData(e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1));
            ShowHideWrapper('show', 'hide', 'hide', 'show');
        }
    }
})