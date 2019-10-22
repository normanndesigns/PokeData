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

function displayPokemonEvolutions(pokemonName, domElement){
    var firstLayerLI = [], secondLayerLI = [];
    emptyOutHTMLTag(domElement);
    if(PokemonData[pokemonName].hasOwnProperty('Evolutions')){
        for(i = 0; i < PokemonData[pokemonName]['Evolutions']['Evolutions'].length; i++){
            if(Array.isArray(PokemonData[pokemonName]['Evolutions']['Evolutions'][i])){
                for(j = 0; j < PokemonData[pokemonName]['Evolutions']['Evolutions'][i].length; j++){
                    if(Array.isArray(PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j])){
                        var thirdLayerLI = []
                        for(k = 0; k < PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j].length; k++){
                            if(PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j].length === k+1){
                                var imageName = ((PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k] == nameException(PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k])) ? imageException(PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k]) : PokemonData[PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k]]['DexID'].replace('#', '') + "-" + PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k] + ".png");
                                thirdLayerLI.push("<div style='color:#" + ColorData[pokemonName]['Color'][1] + ";" + "font-weight:bold" + "'>" + "<img src='assets/media/" + imageName + "'><p>" + PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k] + "<p></div>")
                            }else{
                                var imageName = ((PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k] == name) ? image : PokemonData[PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k]]['DexID'].replace('#', '') + "-" + PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k] + ".png");
                                thirdLayerLI.push("<div style='color:#" + ColorData[pokemonName]['Color'][1] + ";" + "font-weight:bold" + "'>" + "<img src='assets/media/" + imageName + "'><p>" + PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j][k] + "<p></div><div class='betweenArrowsWrapper'>" + '<svg class="betweenArrows" fill=#' + ColorData[pokemonName]['Color'][1] + ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.18 477.18"><path d="M360.73 229.08L135.63 3.98c-5.3-5.3-13.8-5.3-19.1 0s-5.3 13.8 0 19.1l215.5 215.5-215.5 215.5c-5.3 5.3-5.3 13.8 0 19.1 2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4l225.1-225.1c5.3-5.2 5.3-13.8.1-19z"/></svg>' + "</div>")
                            }
                        }
                        secondLayerLI[j] = "<li>" + thirdLayerLI.join("") + "</li>";
                    }else{
                        var imageName = ((PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j] == nameException(PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j]) ? imageException(PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j]) : PokemonData[PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j]]['DexID'].replace('#', '') + "-" + PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j] + ".png"));
                        secondLayerLI.push("<li><div style='color:#" + ColorData[pokemonName]['Color'][1] + ";" + "font-weight:bold" + "'>" + "<img src='assets/media/" + imageName + "'><p>" + PokemonData[pokemonName]['Evolutions']['Evolutions'][i][j] + "</p></div></li>")
                    }
                }
                firstLayerLI[i] = "<ul>" + secondLayerLI.join("") + "</ul>";
            }else{
                var imageName = ((PokemonData[pokemonName]['Evolutions']['Evolutions'][i] == nameException(PokemonData[pokemonName]['Evolutions']['Evolutions'][i])) ? imageException(PokemonData[pokemonName]['Evolutions']['Evolutions'][i]) : PokemonData[PokemonData[pokemonName]['Evolutions']['Evolutions'][i]]['DexID'].replace('#', '') + "-" + PokemonData[pokemonName]['Evolutions']['Evolutions'][i] + ".png");
                firstLayerLI.push("<li><div style='color:#" + ColorData[pokemonName]['Color'][1] + ";" + "font-weight:bold" + "'>" + "<img src='assets/media/" + imageName + "'><p>" + PokemonData[pokemonName]['Evolutions']['Evolutions'][i] + "</p></div></li><div class='betweenArrowsWrapper'>" + '<svg class="betweenArrows" fill=#' + ColorData[pokemonName]['Color'][1] + ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.18 477.18"><path d="M360.73 229.08L135.63 3.98c-5.3-5.3-13.8-5.3-19.1 0s-5.3 13.8 0 19.1l215.5 215.5-215.5 215.5c-5.3 5.3-5.3 13.8 0 19.1 2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4l225.1-225.1c5.3-5.2 5.3-13.8.1-19z"/></svg>' + "</div>");
            }
        }
        domElement.appendChild(document.createRange().createContextualFragment("<h3 class='stats-titles' style='margin-left: 0px; color:" + ColorData[pokemonName]['Color'][1] + "'>Evolution line</h3><ul>" + firstLayerLI.join("") + "</ul>"));
    }
}
function pokemonTypeSelector(type){
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
function nameException(Pokemon){
    if(Pokemon == "Type: Null"){
        return "Type: Null";
    }else if(Pokemon == "Farfetch'd"){
        return "Farfetch'd";
    }
}
function imageException(Pokemon){
    if(Pokemon == "Type: Null"){
        return "772-TypeNull.png";
    }else if(Pokemon == "Farfetch'd"){
        return "083-Farfetch'd.png";
    }
}
function createTypeElement(dom, type){
    div = document.createElement("div");
    div.style.backgroundColor = pokemonTypeSelector(type);
    div.innerHTML = type;
    div.className = "Pokemon-type-objects";
    dom.appendChild(div);
}
function createPokedexEntry(src, dom, file){
    li = document.createElement("li");
    li.className = 'pokemon navigate';
    PokemonNameWOD = file.split('-')[1]
    image = document.createElement("img");
    image.src = src;
    image.alt = removeFileExtension(file);
    text = document.createElement('p');
    if(removeFileExtension(PokemonNameWOD) == "TypeNull"){
        li.setAttribute('data-pokemon', "772-TypeNull");
        image.setAttribute('data-pokemon', "772-TypeNull");
        text.setAttribute('data-pokemon', "772-TypeNull");
        text.innerHTML = "Type: Null"
    }else{
        li.setAttribute('data-pokemon', removeFileExtension(src.substring(src.lastIndexOf("/") + 1)));
        image.setAttribute('data-pokemon', removeFileExtension(src.substring(src.lastIndexOf("/") + 1)));
        text.setAttribute('data-pokemon', removeFileExtension(src.substring(src.lastIndexOf("/") + 1)));
        text.innerHTML = removeFileExtension(PokemonNameWOD);
    }
    li.appendChild(image)
    li.appendChild(text)
    dom.appendChild(li)
}
function emptyOutHTMLTag(dom){
    while (dom.hasChildNodes()) {
        dom.removeChild(dom.firstChild);
    }
}
function removeFileExtension(file){
    return file.split('.')[0]
}
function emptySearchField(){
    document.getElementById('search').value = "";
    search();
}
function setBackgroundColorOfPokemonPage(imageName){
    var pokemonName = imageName.substring(imageName.lastIndexOf("-") + 1)
    displayPokemonData(((pokemonName == "Type: Null") ? "Type: Null" : pokemonName))
    document.getElementById('pokemonImage').style.backgroundColor = ((pokemonName == "Type: Null") ? ColorData["Type: Null"]['Color'][0] : ColorData[pokemonName]['Color'][0]);
    document.getElementById('pokemonImage').style.backgroundImage = ((pokemonName == "Type: Null") ? "url(assets/media/772-TypeNull.png)" : "url(assets/media/" + imageName + ".png)");
    ShowAndHidePokemonPage('show', 'hide', 'hide')     
}
function displayPokemonData(pokemonName){
    for(i = 0; i < document.querySelectorAll("#pokemon-name-en, #pokemon-name-jp, .pokemon-stats-wrapper, .stats-titles, .info-names").length; i++){
        document.querySelectorAll("#pokemon-name-en, #pokemon-name-jp, .pokemon-stats-wrapper, .stats-titles, .info-names")[i].style.color = ColorData[pokemonName]['Color'][1];
        if(i <= 5){
            document.querySelectorAll(".pokemon-stats-bar")[i].style.backgroundColor = ColorData[pokemonName]['Color'][1];
        }
    }
    emptyOutHTMLTag(document.getElementById('pokemon-type-wrapper'));
    for(i = 0; i < PokemonData[pokemonName]["Types"][pokemonName].length; i++){
        createTypeElement(document.getElementById('pokemon-type-wrapper'), PokemonData[pokemonName]["Types"][pokemonName][i])
    }
    document.getElementById('pokemon-nationalnr').innerHTML = PokemonData[pokemonName]['DexID'];
    document.getElementById('pokemon-species').innerHTML = PokemonData[pokemonName]['Category'];
    document.getElementById('pokemon-height').innerHTML = PokemonData[pokemonName]['Height'][pokemonName].join(", ");
    document.getElementById('pokemon-weight').innerHTML = PokemonData[pokemonName]['Weight'][pokemonName].join(", ");
    abilitiesKeys = Object.keys(PokemonData[pokemonName]['PokemonAbilities'])
    pokemonAbilities = PokemonData[pokemonName]['PokemonAbilities'][abilitiesKeys[0]].join(", ");
    document.getElementById('pokemon-abilities').innerHTML = pokemonAbilities.replace('Hidden Ability', "(HA)");
    tempEVYield = [];
    for(i = 0; i < PokemonData[pokemonName]['EVYeild'].length; i++){
        if(!PokemonData[pokemonName]['EVYeild'][i].includes(0)){
            tempEVYield.push([PokemonData[pokemonName]['EVYeild'][i].slice(0, 1), ' ', PokemonData[pokemonName]['EVYeild'][i].slice(1)].join(''))
        }
    }
    document.getElementById('pokemon-ev-yield').innerHTML = tempEVYield.join(", ");
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
    displayPokemonEvolutions(pokemonName, document.getElementById('evolutionWrapper'))
}

function ShowAndHidePokemonPage(pokemonImage, mainWrapper, searchWrapper){
    FlexNone(pokemonImage, document.getElementById('pokemonImage'))
    FlexNone(mainWrapper, document.getElementById('mainWrapper'), 'pokedex-wrapper')
    FlexNone(searchWrapper, document.getElementById('searchWrapper'), 'search-wrapper')
}

function search(){
    tempArray = [];
    tempDexArray = [];
    searchValue = document.getElementById('search').value
    PokemonDataKeys.forEach(function(element, index){
        if(element.includes(searchValue)){
            tempDexArray.push(PokemonData[element]['DexID'])
        }else if(element.toLowerCase().includes(searchValue)){
            tempArray.push(element)
        }
    })
    tempArray = tempArray.sort();
    tempDexArray = tempDexArray.sort();
    for(i = 1; i <= 5; i++){
        if(searchValue.length == 0){
            FlexNone('hide', document.getElementById('result' + i))
        }
        else if(typeof tempArray[i - 1] === 'undefined'){
            FlexNone('hide', document.getElementById('result' + i))
        }else{
            document.getElementById('Showresult' + i).innerHTML = ((tempArray[i - 1] == "Type: Null") ? "Type: Null" : tempArray[i - 1]);
            document.getElementById('Showresult' + i).setAttribute('data-pokemon', ((tempArray[i - 1] == "Type: Null") ? "772-TypeNull" : PokemonData[tempArray[i - 1]]['DexID'].replace('#', '') + "-" + tempArray[i - 1]));
            document.getElementById('imageresult' + i).src = ((tempArray[i - 1] == "Type: Null") ? "assets/media/772-TypeNull.png" : "assets/media/" + PokemonData[tempArray[i - 1]].DexID.replace('#','') + "-" + tempArray[i - 1] + ".png");
            document.getElementById('imageresult' + i).setAttribute('data-pokemon', ((tempArray[i - 1] == "Type: Null") ? "772-TypeNull" : PokemonData[tempArray[i - 1]]['DexID'].replace('#', '') + "-" + tempArray[i - 1]));
            document.getElementById('imageresult' + i).alt = ((tempArray[i - 1] == "Type: Null") ? "Type: Null" : PokemonData[tempArray[i - 1]].DexID.replace('#','') + "-" + tempArray[i - 1]);    
            document.getElementById('result' + i).setAttribute('data-pokemon', ((tempArray[i - 1] == "Type: Null") ? "772-TypeNull" : PokemonData[tempArray[i - 1]]['DexID'].replace('#', '') + "-" + tempArray[i - 1]));
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
        createPokedexEntry("../public/assets/media/" + files[i], document.getElementById('mainWrapper'), files[i])
    }
})

document.getElementById('searchBTN').addEventListener('click', () => {
    emptySearchField()
    ShowAndHidePokemonPage('hide', 'hide', 'show')
})
document.getElementById('pokedexBTN').addEventListener('click', () => {
    emptySearchField()
    ShowAndHidePokemonPage('hide', 'show', 'hide')
})

document.getElementById('searchResults').addEventListener('click', (e) => {setBackgroundColorOfPokemonPage(e.target.getAttribute('data-pokemon'))})

document.getElementById('searchResults').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target !== document.getElementById('searchResults')){
            setBackgroundColorOfPokemonPage(e.target.getAttribute('data-pokemon'))
        }
    }
})

document.getElementById('backBTN').addEventListener('click', () => {
    emptySearchField()
    ShowAndHidePokemonPage('hide', 'hide', 'show')
})

document.getElementById('mainWrapper').addEventListener('click', (e) => {setBackgroundColorOfPokemonPage(e.target.getAttribute('data-pokemon'))})

document.getElementById('mainWrapper').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target.tagName === "LI"){
            setBackgroundColorOfPokemonPage(e.target.getAttribute('data-pokemon'))
        }
    }
})