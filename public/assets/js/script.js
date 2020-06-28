const {remote} = require('electron'); 
const fs = require('electron').remote.require('fs')
const path = require('electron').remote.require('path')
var PokemonFile = fs.readFileSync('public/assets/data/Pokedex.json', 'utf8')
var PokemonData = JSON.parse(PokemonFile);
var ColorFile = fs.readFileSync('public/assets/data/ColorData.json', 'utf8')
var ColorData = JSON.parse(ColorFile);

var PokemonDataKeys = Object.keys(PokemonData);
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
    tempFile = file.replace(".png", "")
    outputFile = tempFile.replace('.svg', "")
    return outputFile
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
            if(tempArray[i - 1] == "Farfetch'd"){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]].NationalDexID + "-" + "Farfetchd" + ".png";
            }else if(tempArray[i - 1] == "Sirfetch'd"){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]].NationalDexID + "-" + "Sirfetchd" + ".png";
            }else if(tempArray[i - 1] == "Type: Null"){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]].NationalDexID + "-" + "Type_Null" + ".png";
            }else if(tempArray[i - 1] == "Nidoran\u2640"){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]].NationalDexID + "-" + "Nidoran" + ".png";
            }else if(tempArray[i - 1] == "Nidoran\u2642"){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]].NationalDexID + "-" + "Nidoran" + ".png";
            }else if(tempArray[i - 1].includes(" ")){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]].NationalDexID + "-" + tempArray[i - 1].replace(" ","_") + ".png";
            }else{
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]].NationalDexID + "-" + tempArray[i - 1] + ".png";
            }

            document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]].NationalDexID + "-" + tempArray[i - 1];
            FlexNone('show', document.getElementById('result' + i))
        }
    }
}

function InsertPokemonData(PokemonName, color){
    DarkOrLight = lightOrDark(color)
    document.getElementById('name').innerHTML = PokemonName
    if(DarkOrLight == "dark"){
        document.getElementById('name').style.color = "#ffffff";
    }else{
        document.getElementById('name').style.color = "#000000";
    }
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
        if(tempImageFileArray.length <= 2){
            if(files[i] == "083-Farfetchd.png"){
                createListEntry("../public/assets/media/" + "083-Farfetchd.png", document.getElementById('mainWrapper'), "083-Farfetch'd.png")
            }else if(files[i] == "865-Sirfetchd.png"){
                createListEntry("../public/assets/media/" + "865-Sirfetchd.png", document.getElementById('mainWrapper'), "865-Sirfetch'd.png")
            }else if(files[i] == "029-Nidoran.png"){
                createListEntry("../public/assets/media/" + "029-Nidoran.png", document.getElementById('mainWrapper'), "029-Nidoran\u2640.png")
            }else if(files[i] == "032-Nidoran.png"){
                createListEntry("../public/assets/media/" + "032-Nidoran.png", document.getElementById('mainWrapper'), "032-Nidoran\u2642.png")

            }else if(files[i] == "772-Type_Null.png"){
                createListEntry("../public/assets/media/" + "772-Type_Null.png", document.getElementById('mainWrapper'), "772-Type: Null.png")
            }else if(files[i].includes("_")){
                createListEntry("../public/assets/media/" + files[i], document.getElementById('mainWrapper'), files[i].replace("_", " "))
            }else{
                createListEntry("../public/assets/media/" + files[i], document.getElementById('mainWrapper'), files[i])
            }
        }
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
                InsertPokemonData(e.target.parentNode.childNodes[3].innerHTML, RGBtoHex(ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][0],ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][1],ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][2]))
                document.getElementById('pokemonImage').style.backgroundColor = 'rgb(' + ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'] + ')';
                if(e.target.parentNode.childNodes[1].alt.includes("Farfetch'd") || e.target.parentNode.childNodes[1].alt.includes("Sirfetch'd")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt.replace("'","") + '.png)'
                }else if(e.target.parentNode.childNodes[1].alt.includes("\u2640")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt.replace("\u2640","") + '.png)'
                }else if(e.target.parentNode.childNodes[1].alt.includes("\u2642")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt.replace("\u2642","") + '.png)'
                }else if(e.target.parentNode.childNodes[1].alt.includes(": ")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt.replace(": ","_") + '.png)'
                }else if(e.target.parentNode.childNodes[1].alt.includes(" ")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt.replace(" ","_") + '.png)'
                }else{
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt + '.png)'
                }
                ShowHideWrapper('show', 'hide', 'hide')
            }else if(e.target.tagName === 'IMG'){
                InsertPokemonData(e.target.parentNode.childNodes[3].innerHTML,  RGBtoHex(ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][0],ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][1],ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'][2]))
                document.getElementById('pokemonImage').style.backgroundColor = 'rgb(' + ColorData[e.target.parentNode.childNodes[3].innerHTML]['Color'] + ')';
                if(e.target.alt.includes("Farfetch'd") || e.target.alt.includes("Sirfetch'd")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt.replace("'","") + '.png)'
                }else if(e.target.alt.includes("\u2640")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt.replace("\u2640","") + '.png)'
                }else if(e.target.alt.includes("\u2642")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt.replace("\u2642","") + '.png)'
                }else if(e.target.alt.includes(": ")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt.replace(": ","_") + '.png)'
                }else if(e.target.alt.includes(" ")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt.replace(" ","_") + '.png)'
                }else{
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt + '.png)'
                }
                ShowHideWrapper('show', 'hide', 'hide')
            }else{
                InsertPokemonData(e.target.childNodes[3].innerHTML, RGBtoHex(ColorData[e.target.childNodes[3].innerHTML]['Color'][0],ColorData[e.target.childNodes[3].innerHTML]['Color'][1],ColorData[e.target.childNodes[3].innerHTML]['Color'][2]))
                document.getElementById('pokemonImage').style.backgroundColor = 'rgb(' + ColorData[e.target.childNodes[3].innerHTML]['Color'] + ')';
                if(e.target.childNodes[1].alt.includes("Farfetch'd") || e.target.childNodes[1].alt.includes("Sirfetch'd")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace("'", "") + '.png)'
                }else if(e.target.childNodes[1].alt.includes("\u2640")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace("\u2640", "") + '.png)'
                }else if(e.target.childNodes[1].alt.includes("\u2642")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace("\u2642", "") + '.png)'
                }else if(e.target.childNodes[1].alt.includes(": ")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace(": ", "_") + '.png)'
                }else if(e.target.childNodes[1].alt.includes(" ")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace(" ", "_") + '.png)'
                }else{
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt + '.png)'
                }
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
                InsertPokemonData(e.target.childNodes[3].innerHTML, RGBtoHex(ColorData[e.target.childNodes[3].innerHTML]['Color'][0],ColorData[e.target.childNodes[3].innerHTML]['Color'][1],ColorData[e.target.childNodes[3].innerHTML]['Color'][2]))
                if(e.target.childNodes[1].alt.includes("Farfetch'd") || e.target.childNodes[1].alt.includes("Sirfetch'd")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace("'","") + '.png)'
                }else if(e.target.childNodes[1].alt.includes("\u2640")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace("\u2640","") + '.png)'
                }else if(e.target.childNodes[1].alt.includes("\u2642")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace("\u2642","") + '.png)'
                }else if(e.target.childNodes[1].alt.includes(": ")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace(": ","_") + '.png)'
                }else if(e.target.childNodes[1].alt.includes(" ")){
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt.replace(" ","_") + '.png)'
                }else{
                    document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt + '.png)'
                }
                document.getElementById('pokemonImage').style.backgroundColor = 'rgb(' + ColorData[e.target.childNodes[3].innerHTML]['Color'] + ')';
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
        InsertPokemonData(e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1), RGBtoHex(ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][0],ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][1],ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][2]))
        if(e.target.childNodes[0].alt.includes("Farfetch'd") || e.target.childNodes[0].alt.includes("Sirfetch'd")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace("'","") + '.png)'
        }else if(e.target.childNodes[0].alt.includes("\u2640")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace("\u2640","") + '.png)'
        }else if(e.target.childNodes[0].alt.includes("\u2642")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace("\u2642","") + '.png)'

        }else if(e.target.childNodes[0].alt.includes(": ")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace(": ","_") + '.png)'
        }else if(e.target.childNodes[0].alt.includes(" ")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace(" ","_") + '.png)'
        }else{
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt + '.png)'
        }
        document.getElementById('pokemonImage').style.backgroundColor = 'rgb(' + ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'] + ')';
        ShowHideWrapper('show', 'hide', 'hide')
    }
    else if(e.target.tagName === "IMG"){
        InsertPokemonData(e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1), RGBtoHex(ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][0],ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][1],ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][2]))
        if(e.target.parentNode.childNodes[0].alt.includes("Farfetch'd") || e.target.parentNode.childNodes[0].alt.includes("Sirfetch'd")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace("'","") + '.png)';
        }else if(e.target.parentNode.childNodes[0].alt.includes("\u2640")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace("\u2640","") + '.png)';
        }else if(e.target.parentNode.childNodes[0].alt.includes("\u2642")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace("\u2642","") + '.png)';

        }else if(e.target.parentNode.childNodes[0].alt.includes(": ")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace(": ","_") + '.png)';
        }else if(e.target.parentNode.childNodes[0].alt.includes(" ")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace(" ","_") + '.png)';
        }else{
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + '.png)';
        }
        document.getElementById('pokemonImage').style.backgroundColor = 'rgb(' + ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'] + ')';
        ShowHideWrapper('show', 'hide', 'hide')
    }
    else if(e.target.tagName === "P"){
        InsertPokemonData(e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1), RGBtoHex(ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][0],ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][1],ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'][2]))
        if(e.target.parentNode.childNodes[0].alt.includes("Farfetch'd") || e.target.parentNode.childNodes[0].alt.includes("Sirfetch'd")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace("'","") + '.png)';
        }else if(e.target.parentNode.childNodes[0].alt.includes("\u2640")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace("\u2640","") + '.png)';
        }else if(e.target.parentNode.childNodes[0].alt.includes("\u2642")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace("\u2642","") + '.png)';

        }else if(e.target.parentNode.childNodes[0].alt.includes(": ")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace(": ","_") + '.png)';
        }else if(e.target.parentNode.childNodes[0].alt.includes(" ")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt.replace(" ","_") + '.png)';
        }else{
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + '.png)';
        }
        document.getElementById('pokemonImage').style.backgroundColor = 'rgb(' + ColorData[e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1)]['Color'] + ')';
        ShowHideWrapper('show', 'hide', 'hide')
    }
})

document.getElementById('mainWrapper').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target.tagName === "LI"){
            InsertPokemonData(e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1), RGBtoHex(ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][0],ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][2],ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'][2]))
            if(e.target.childNodes[1].innerHTML.includes("Farfetch'd") || e.target.childNodes[1].innerHTML.includes("Sirfetch'd")){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace("'","") + '.png)'
            }else if(e.target.childNodes[1].innerHTML.includes("\u2640")){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace("\u2640","") + '.png)'
            }else if(e.target.childNodes[1].innerHTML.includes("\u2642")){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace("\u2642","") + '.png)'

            }else if(e.target.childNodes[1].innerHTML.includes(": ")){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace(": ","_") + '.png)'
            }else if(e.target.childNodes[1].innerHTML.includes(" ")){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt.replace(" ","_") + '.png)'
            }else{
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt + '.png)'
            }
            document.getElementById('pokemonImage').style.backgroundColor = 'rgb(' + ColorData[e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1)]['Color'] + ')';
            ShowHideWrapper('show', 'hide', 'hide')
        }
    }
})