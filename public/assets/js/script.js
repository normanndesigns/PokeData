const {remote} = require('electron'); 
const { read } = require('fs');
const fs = require('electron').remote.require('fs')
const fetch = require('node-fetch');
const path = require('electron').remote.require('path')
const PokemonFile = fs.readFileSync('public/assets/data/Pokedex.json', 'utf8')
const PokemonData = JSON.parse(PokemonFile);
const PokemonDataKeys = Object.keys(PokemonData);
const EvolutionFile = fs.readFileSync('public/assets/data/Evolution.json', 'utf8')
const EvolutionData = JSON.parse(EvolutionFile);
const TypeColorFile = fs.readFileSync('public/assets/data/TypeColor.json', 'utf8')
const TypeColorData = JSON.parse(TypeColorFile);

document.getElementById('closeBTN').addEventListener('click', closeWindow)
document.getElementById('minimizeBTN').addEventListener('click', minimizeWindow)
document.getElementById('maximizeBTN').addEventListener('click', maximizeWindow)
document.getElementById('search').addEventListener('keyup', search)

function FlexNone(display, object, extraClasses = ""){
    if(display == 'hide'){
        object.className = 'none ' + extraClasses;
    }else if(display == 'show'){
        object.className = 'flex ' + extraClasses;
    }
}   

function closeWindow(){
    let window = remote.getCurrentWindow();
    window.close();
}
function minimizeWindow(){
    let window = remote.getCurrentWindow();
    window.minimize();
}
function maximizeWindow(){
    let window = remote.getCurrentWindow();
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
        let PokemonName = []
        for (let key in PokemonData) {
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
                image.alt = file.replace(".png","-Galarian.png");
            }else if(element.includes('Single Strike')){
                image.src = src.replace(".png","-(Single-Strike).png");
                image.alt = file.replace(".png","-(Single-Strike).png");
            }else if(element.includes('Rapid Strike')){
                image.src = src.replace(".png","-(Rapid-Strike).png");
                image.alt = file.replace(".png","-(Rapid-Strike).png");
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

function ShowHideWrapper(pokemonImage, mainWrapper, searchWrapper, circleWrapper, loading){
    FlexNone(pokemonImage, document.getElementById('pokemonImage'))
    FlexNone(mainWrapper, document.getElementById('mainWrapper'), 'pokedex-wrapper')
    FlexNone(searchWrapper, document.getElementById('searchWrapper'), 'search-wrapper')
    FlexNone(circleWrapper, document.getElementById('circle-wrapper'), 'circle-wrapper')
    FlexNone(loading, document.getElementById('loading'))
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
            if(tempArray[i - 1].includes('alolan')){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]] + "-Alolan" +  ".png";
                document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]] + "-Alolan" + '.png';
            }else if(tempArray[i - 1].includes('galarian')){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]] + "-Galarian" + ".png";
                document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]] + "-Galarian" + '.png';
            }else if(tempArray[i - 1].includes('single')){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]] + "-(Single-Strike)" + ".png";
                document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]] + "-(Single-Strike)" + '.png';
            }else if(tempArray[i - 1].includes('rapid')){
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]] + "-(Rapid-Strike)" + ".png";
                document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]] + "-(Rapid-Strike)" + '.png';
            }
            else{
                document.getElementById('imageresult' + i).src = "assets/media/" + PokemonData[tempArray[i - 1]] + ".png";
                document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1]] + '.png';
            }
            FlexNone('show', document.getElementById('result' + i))
        }
    }
}

function EvolutionLine(PokemonName){
    var Variants = {
        "Darmanitan Standard": "Darmanitan",
        "Galarian Darmanitan Standard": "Galarian Darmanitan"
    }
    if(Variants[PokemonName] != undefined){
        PokemonName = Variants[PokemonName];
    }
    document.getElementById("Stage0").innerHTML = "";
    document.getElementById("Stage1").innerHTML = "";
    document.getElementById("Stage2").innerHTML = "";
    if(EvolutionData[PokemonName] != undefined){
        for (Key in EvolutionData[PokemonName]){
            DivWrapper = document.createElement('div');
            DivWrapper.className = "pokemon-evo";
            PokemonWrapper = document.createElement('div');
            PokemonWrapper.className = "EvoPokemon";

            ImgTag = document.createElement('img');
            if(Key.includes("Alolan")){
                ImgTag.src = "assets/media/" + EvolutionData[PokemonName][Key]["PokeDexIDs"] + "-Alolan.png";
            }else if(Key.includes("Galarian")){
                ImgTag.src = "assets/media/" + EvolutionData[PokemonName][Key]["PokeDexIDs"] + "-Galarian.png";
            }else if(Key.includes("Single")){
                ImgTag.src = "assets/media/" + EvolutionData[PokemonName][Key]["PokeDexIDs"] + "-(Single-Strike).png";
            }else if(Key.includes("Rapid")){
                ImgTag.src = "assets/media/" + EvolutionData[PokemonName][Key]["PokeDexIDs"] + "-(Rapid-Strike).png";
            }else{
                ImgTag.src = "assets/media/" + EvolutionData[PokemonName][Key]["PokeDexIDs"] + ".png";
            }

            ImgTag.alt = EvolutionData[PokemonName][Key]["PokeDexIDs"] + ".png";
            PokemonWrapper.appendChild(ImgTag);

            PTag = document.createElement('p');
            PTag.innerHTML = Key;
            PokemonWrapper.appendChild(PTag);

            if(typeof EvolutionData[PokemonName][Key]["HowToEvolve"] === 'object' && EvolutionData[PokemonName][Key]["HowToEvolve"] !== null){
                MethodWrapper = document.createElement('div');
                for (let [key, value] of Object.entries(EvolutionData[PokemonName][Key]["HowToEvolve"])) {
                    if(EvolutionData[PokemonName][Key]["HowToEvolve"] != "Final Form"){
                        EvoMethod = document.createElement('div');
                        EvoMethodPTag = document.createElement('p');
                        EvoMethodPTag.className = "EvoSteps";
                        EvoMethodPTag.innerHTML = value;
                        EvoMethod.appendChild(EvoMethodPTag);
                        MethodWrapper.appendChild(EvoMethod)
                    }
                  }
                DivWrapper.appendChild(PokemonWrapper)
                DivWrapper.appendChild(MethodWrapper)
            }else{
                EvoMethod = document.createElement('div');
                EvoMethodPTag = document.createElement('p');
                EvoMethodPTag.className = "EvoSteps";
                if(EvolutionData[PokemonName][Key]["HowToEvolve"].toLowerCase() != "final form"){
                    EvoMethodPTag.innerHTML = EvolutionData[PokemonName][Key]["HowToEvolve"];
                }
                EvoMethod.appendChild(EvoMethodPTag);
                DivWrapper.appendChild(PokemonWrapper)
                DivWrapper.appendChild(EvoMethod)
            } 
            
            ImgTag.dataset.pokemonimg = ImgTag.src;
            ImgTag.dataset.pokemonname = Key;
            ImgTag.dataset.dexid = EvolutionData[PokemonName][Key]["PokeDexIDs"];
            PTag.dataset.pokemonimg = ImgTag.src;
            PTag.dataset.pokemonname = Key;
            PTag.dataset.dexid = EvolutionData[PokemonName][Key]["PokeDexIDs"];

            Stage = "Stage" + EvolutionData[PokemonName][Key]["EvolutionStage"]
            document.getElementById(Stage).append(DivWrapper)

        }
    }
}

async function InsertPokemonData(PokemonName){
    ShowHideWrapper("hide", "hide", "hide", "hide", "show")
    var Variants = {
        "Deoxys": "Normal",
        "Giratina": "Altered",
        "Shaymin": "Land",
        "Basculin": "Red-Striped",
        "Darmanitan": "Standard",
        "Galarian Darmanitan": "Standard",
        "Tornadus": "Incarnate",
        "Thundurus": "Incarnate",
        "Landorus": "Incarnate",
        "Keldeo": "Ordinary",
        "Meloetta": "Aria"
    }
    DexID = PokemonData[PokemonName.toLowerCase()]
    OriginalPokemonName = "";
    if(Variants[PokemonName] != undefined){
        OriginalPokemonName = PokemonName;
        PokemonName = PokemonName + " " + Variants[PokemonName];
    }
    if(PokemonName === "Urshifu (Single Strike)"){
        PokemonNameForLink = "urshifu-single-strike";
    }else if(PokemonName === "Urshifu (Rapid Strike)"){
        PokemonNameForLink = "urshifu-rapid-strike";
    }else{
        PokemonNameForLink = PokemonName.replace('.',"").replace(':',"").replace("'","").replaceAll(' ',"-").replace("♂", "-m").replace("♀", "-f")
    }
    if(PokemonNameForLink.includes('Alolan')){
        if(Variants[PokemonName] != undefined){
            PokemonName = PokemonName + " " + Variants[PokemonName];
        }
        var endpoint = PokemonNameForLink.toLowerCase().replace("'","").replace("alolan-","") + "-alola"
    }else if(PokemonNameForLink.includes('Galarian')){
        var endpoint = PokemonNameForLink.toLowerCase().replace("'","").replace("galarian-","")  + "-galar"
    }else{
        if(!Number(PokemonData[PokemonNameForLink.toLowerCase()]) === NaN){
            var endpoint = Number(PokemonData[PokemonNameForLink.toLowerCase()])
        }else{
            endpoint = PokemonNameForLink.toLowerCase();
        }
    }
    console.log('https://pokeapi.co/api/v2/pokemon/' + endpoint)
    response = await fetch('https://pokeapi.co/api/v2/pokemon/' + endpoint)
    obj = await response.json();
        if(OriginalPokemonName === ""){
            document.getElementById('name').innerHTML = PokemonName;
        }else{
            document.getElementById('name').innerHTML = OriginalPokemonName;
        }
        document.getElementById('name').style.color = "#000000";
        document.getElementById('DexID').innerHTML = "#" + document.getElementById("pokemonImage").getAttribute("data-dexid").replace(/[^0-9]/g, "");
        document.getElementById('DexID').style.color = TypeColorData[obj["types"][0]["type"]["name"]];
        document.getElementById("st0").style.fill = TypeColorData[obj["types"][0]["type"]["name"]];
        document.getElementById("type-wrapper").innerHTML = "";
        for (i = 0; i < obj["types"].length; i++) {
            let type = document.createElement("div"); 
            let typeIcon = document.createElement("div"); 
            let TypeIconImage = document.createElement("img"); 
            let typeName = document.createElement("span"); 

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
        }
        let stats = ["HP", "Attack", "Defense", "Special-Attack", "Special-Defense", "Speed"];
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
            EvolutionLine(PokemonName.replace("-"," "));
            ShowHideWrapper("show", "hide", "hide", "show", "hide")
            document.getElementById("loading").className = "none";
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
    ShowHideWrapper('hide', 'hide', 'show', 'hide', "hide")
})
document.getElementById('pokedexBTN').addEventListener('click', () => {
    emptySearch()
    ShowHideWrapper('hide', 'show', 'hide', 'hide', 'hide')
})
document.getElementById('backBTN').addEventListener('click', () => {
    emptySearch()
    ShowHideWrapper('hide', 'hide', 'show', 'hide', 'hide')
})

document.getElementById('searchResults').addEventListener('click', (e) => {
    if(e.target !== document.getElementById('searchResults')){
        if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
            if(e.target.tagName === 'DIV'){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[1].alt + ')';
                document.getElementById('pokemonImage').dataset.dexid = e.target.parentNode.childNodes[1].alt.replace(".png", "");
                InsertPokemonData(capitalizeFirstLetter(e.target.parentNode.childNodes[3].innerHTML));
            }else if(e.target.tagName === 'IMG'){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.alt + ')';
                document.getElementById('pokemonImage').dataset.dexid = e.target.alt.replace(".png", "");
                InsertPokemonData(capitalizeFirstLetter(e.target.parentNode.childNodes[3].innerHTML));
            }else{
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt + ')';
                document.getElementById('pokemonImage').dataset.dexid = e.target.childNodes[1].alt.replace(".png", "");
                InsertPokemonData(capitalizeFirstLetter(e.target.childNodes[3].innerHTML));
            }
            
        }
    }
})

document.getElementById('searchResults').addEventListener('keypress', (e) => {
    let key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target !== document.getElementById('searchResults')){
            if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
                document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[1].alt + ')';
                document.getElementById('pokemonImage').dataset.dexid = e.target.childNodes[1].alt.replace(".png", "");
                InsertPokemonData(capitalizeFirstLetter(e.target.childNodes[3].innerHTML));
            }
        }
    }
})

document.getElementById('mainWrapper').addEventListener('click', (e) => {
    if(e.target.tagName === "LI"){
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt + ')';
        document.getElementById('pokemonImage').dataset.dexid = e.target.childNodes[0].alt;
        InsertPokemonData(e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1));
    }
    else if(e.target.tagName === "IMG"){
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + ')';
        document.getElementById('pokemonImage').dataset.dexid = e.target.parentNode.childNodes[0].alt;
        InsertPokemonData(e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1));
    }
    else if(e.target.tagName === "P"){
        document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.parentNode.childNodes[0].alt + ')';
        document.getElementById('pokemonImage').dataset.dexid = e.target.parentNode.childNodes[0].alt;
        InsertPokemonData(e.target.parentNode.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.parentNode.childNodes[1].innerHTML.slice(1));
    }
})
document.getElementById('mainWrapper').addEventListener('keypress', (e) => {
    let key = e.which || e.keyCode;
    if (key === 13) {
        if(e.target.tagName === "LI"){
            document.getElementById('pokemonImage').style.backgroundImage = 'url(assets/media/' + e.target.childNodes[0].alt + ')';
            document.getElementById('pokemonImage').dataset.dexid = e.target.childNodes[0].alt.replace(".png", "");
            InsertPokemonData(e.target.childNodes[1].innerHTML.charAt(0).toUpperCase() + e.target.childNodes[1].innerHTML.slice(1));
        }
    }
})

document.getElementById("evolution-wrapper").addEventListener('click', (e) => {
    if(e.target.tagName === "P" || e.target.tagName === "IMG" ){
        if(e.target.className != "EvoSteps"){
            document.getElementById('pokemonImage').style.backgroundImage = "url(" + e.target.dataset.pokemonimg + ")";
            document.getElementById('pokemonImage').dataset.dexid = e.target.dataset.dexid;
            document.getElementById("pokemonImage").scrollTo(0,0)
            InsertPokemonData(e.target.dataset.pokemonname);
        }
    }
})