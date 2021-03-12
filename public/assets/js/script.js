const { ipcRenderer } = require('electron')
const configsData = JSON.parse(ipcRenderer.sendSync('LoadConfig'));
const LoadVariantsData = JSON.parse(ipcRenderer.sendSync('LoadVariants'));
const PokemonData = JSON.parse(ipcRenderer.sendSync('LoadPokedex'));
const PokemonDataKeys = Object.keys(PokemonData);
const EvolutionData = JSON.parse(ipcRenderer.sendSync('LoadEvolution'));
const TypeColorData = JSON.parse(ipcRenderer.sendSync('LoadTypeColor'));

document.getElementById("NorR").value = configsData.Dextype;

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
    ipcRenderer.send('CloseWindow')
}
function minimizeWindow(){
    ipcRenderer.send('MinimizeWindow')
}
function maximizeWindow(){
    ipcRenderer.send('MaximizeWindow')
}

function capitalizeFirstLetter(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
function imageGeneration(ImageNumber){
    if(parseInt(ImageNumber) <= 151){
        return "gen1";
    }else if(parseInt(ImageNumber) <= 251){
        return "gen2";
    }else if(parseInt(ImageNumber) <= 386){
        return "gen3";
    }else if(parseInt(ImageNumber) <= 493){
        return "gen4";
    }else if(parseInt(ImageNumber) <= 649){
        return "gen5";
    }else if(parseInt(ImageNumber) <= 721){
        return "gen6";
    }else if(parseInt(ImageNumber) <= 807){
        return "gen7";
    }else if(parseInt(ImageNumber) <= 898){
        return "gen8";
    }      
}
function createListEntry(src, dom, file, Name, PokeDexType){
    div = Object.assign(document.createElement("li"), {className: "pokemon navigate"})
    image = document.createElement("img");
    if(Name.includes("-") && Name != "jangmo-o" && Name != "hakamo-o" && Name != "kommo-o"){
        if(Name === "porygon-z" || Name === "ho-oh"){
            NameArray = Name.split("-")
            for (let i = 0; i < NameArray.length; i++) {
                NameArray[i] = NameArray[i][0].toUpperCase() + NameArray[i].substr(1);
            }
            PokemonName = NameArray.join("-")
        }
    }else if(Name.includes(" ")){
        NameArray = Name.split(" ")
        for (let i = 0; i < NameArray.length; i++) {
            NameArray[i] = NameArray[i][0].toUpperCase() + NameArray[i].substr(1);
        }
        PokemonName = NameArray.join(" ");
    }else{
        PokemonName = capitalizeFirstLetter(Name)
    }
    if(PokeDexType === "national"){
        GenerationsOBJ = {
            "001": "Generation 1",
            "152": "Generation 2",
            "252": "Generation 3",
            "387": "Generation 4",
            "494": "Generation 5",
            "650": "Generation 6",
            "722": "Generation 7",
            "808": "Generation 8"
        }
        if(GenerationsOBJ[PokemonData[Name.toLowerCase()]] != undefined){
            Header2 = Object.assign(document.createElement("h2"), {className: "GenerationHeaders", innerHTML: GenerationsOBJ[PokemonData[Name.toLowerCase()]]})
            dom.appendChild(Header2)
        }
    }
    if(ImageFileArray.includes(src)){
        image.src = src;
    }else if(ImageFileArray.includes(src.replace(".png", "-FemaleVersion.png"))){
        image.src = src.replace(".png", "-FemaleVersion.png");
    }else if(ImageFileArray.includes(file.replace(".png", "-MaleVersion.png"))){
        image.src = src.replace(".png", "-MaleVersion.png")
    }
    text = Object.assign(document.createElement("p"), {innerHTML: PokemonName})
    image.alt = file;
    div.appendChild(image)
    div.appendChild(text)
    dom.appendChild(div) 
}

function emptySearch(){
    document.getElementById('search').value = "";
    search();
}

function ShowHideWrapper(pokemonImage, settingsWrapper, mainWrapper, searchWrapper, circleWrapper, loading){
    FlexNone(settingsWrapper, document.getElementById('settingsWrapper'), "settings-wrapper")
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
        if(element.toLowerCase().startsWith(searchValue)){
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
            document.getElementById('imageresult' + i).src = "assets/media/" + imageGeneration(PokemonData[tempArray[i - 1]]) + "/" + MaleOrFemaleVersion(PokemonData[tempArray[i - 1]] + ".png", tempArray[i - 1]);
            document.getElementById('imageresult' + i).alt = MaleOrFemaleVersion(PokemonData[tempArray[i - 1]] + ".png", tempArray[i - 1]);
            FlexNone('show', document.getElementById('result' + i))
        }
    }
}

function EvolutionLine(PokemonName, form){
    if(EvolutionData[PokemonName] != undefined){
        document.getElementsByClassName("section-title")[0].className = "section-title flex";
        for (Key in EvolutionData[PokemonName]){
            let DivWrapper = Object.assign(document.createElement('div'), {className: 'pokemon-evo'});
            let PokemonWrapper = Object.assign(document.createElement('div'), {className: 'EvoPokemon'});
            let ImgTag = Object.assign(document.createElement('img'), {
                src: "assets/media/" + imageGeneration(PokemonData[Key.toLowerCase()]) + "/" + MaleOrFemaleVersion(PokemonData[Key.toLowerCase()] + ".png", Key),
                alt: EvolutionData[PokemonName][Key]["PokeDexIDs"] + ".png", 
            });
            ImgTag.dataset.pokemonimg = MaleOrFemaleVersion(PokemonData[Key.toLowerCase()] + ".png", Key);
            PokemonWrapper.appendChild(ImgTag);
            let PTag = Object.assign(document.createElement('p'), {innerHTML: Key});
            PokemonWrapper.appendChild(PTag);

            if(typeof EvolutionData[PokemonName][Key]["HowToEvolve"] === 'object' && EvolutionData[PokemonName][Key]["HowToEvolve"] !== null){
                MethodWrapper = Object.assign(document.createElement("div"))

                for (let [key, value] of Object.entries(EvolutionData[PokemonName][Key]["HowToEvolve"])) {
                    if(EvolutionData[PokemonName][Key]["HowToEvolve"] != "Final Form"){
                        let EvoMethod = Object.assign(document.createElement('div'));
                        let EvoMethodPTag = Object.assign(document.createElement('p'), {className: "EvoSteps", innerHTML: value});
                        EvoMethod.appendChild(EvoMethodPTag);
                        MethodWrapper.appendChild(EvoMethod)
                    }
                  }
                DivWrapper.appendChild(PokemonWrapper)
                DivWrapper.appendChild(MethodWrapper)
            }else{
                let EvoMethod = Object.assign(document.createElement('div'));
                let EvoMethodPTag = Object.assign(document.createElement('p'), {className: "EvoSteps"});
                if(EvolutionData[PokemonName][Key]["HowToEvolve"].toLowerCase() != "final form"){
                    EvoMethodPTag.innerHTML = EvolutionData[PokemonName][Key]["HowToEvolve"];
                }
                EvoMethod.appendChild(EvoMethodPTag);
                DivWrapper.appendChild(PokemonWrapper)
                DivWrapper.appendChild(EvoMethod)
            } 
            
            ImgTag.dataset.pokemonname = Key;
            ImgTag.dataset.dexid = EvolutionData[PokemonName][Key]["PokeDexIDs"];
            PTag.dataset.pokemonimg = ImgTag.dataset.pokemonimg;
            PTag.dataset.pokemonname = Key;
            PTag.dataset.dexid = EvolutionData[PokemonName][Key]["PokeDexIDs"];

            Stage = "Stage" + EvolutionData[PokemonName][Key]["EvolutionStage"];
            document.getElementById(Stage).append(DivWrapper)
        }
    }else{
        document.getElementsByClassName("section-title")[0].className = "section-title none";
    }
}

async function InsertPokemonData(PokemonName){
    ShowHideWrapper("hide", "hide", "hide", "hide", "hide", "show")
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
        "Meloetta": "Aria",
        "Zacian Hero": "",
        "Zacian crowned": "",
        "Zamazenta Hero": "",
        "Zamazenta crowned": "",
        "Urshifu (Single Strike)": "",
        "Urshifu (Rapid Strike)": ""
    }
    DexID = PokemonData[PokemonName.toLowerCase()]
    OriginalPokemonName = "";
    if(Variants[PokemonName] != undefined){
        OriginalPokemonName = PokemonName;
        if(Variants[PokemonName] != ""){
            PokemonName = PokemonName + " " + Variants[PokemonName];
        }
    }

    PokemonNameForLink = PokemonName.replace('.',"").replace(':',"").replace("'","").replaceAll(' ',"-").replace("♂", "-m").replace("♀", "-f").replace('(', '').replace(')', '')
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
    ipcRenderer.send('PokemonData', endpoint)
    ipcRenderer.on('PokemonDataReply', (event, obj) => {
        if(OriginalPokemonName === ""){
            document.getElementById('name').innerHTML = PokemonName;
        }else{
            document.getElementById('name').innerHTML = OriginalPokemonName;
        }
        document.getElementById('name').style.color = "#000000";
        
        document.getElementById('DexID').innerHTML = "#" + document.getElementById("pokemonImage").getAttribute("data-imagefilename").replace(/[^0-9]/g, "");
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
            TypeIconImage.src = "assets/static/" + capitalizeFirstLetter(obj["types"][i]["type"]["name"]) + ".svg"

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
            for(i = 0; i < 3; i++){
                document.getElementsByClassName('evolution-wrapper')[i].childNodes[1].innerHTML = "";
                document.getElementsByClassName('evolution-wrapper')[i].childNodes[3].innerHTML = "";
                document.getElementsByClassName('evolution-wrapper')[i].childNodes[5].innerHTML = "";
            }

            if(!PokemonName === "Jangmo-o" || !PokemonName === "Hakamo-o" || !PokemonName === "Kommo-o"){
                EvolutionLine(PokemonName.replace("-"," "));
            }else{
                EvolutionLine(PokemonName);
            }
            ShowHideWrapper("show", "hide", "hide", "hide", "show", "hide")
            document.getElementById("loading").className = "none";
    })    
}

window.addEventListener('load', function() {
    SpatialNavigation.init();
    SpatialNavigation.add({
        selector: 'li, .navigate'
    });
    SpatialNavigation.makeFocusable();
});
ImageFileArray = ipcRenderer.sendSync('LoadImages')
if(configsData.Dextype === "regional"){
    const RegionalDexData = JSON.parse(ipcRenderer.sendSync('LoadRegionalDex'));
    for (const [Region, Dex] of Object.entries(RegionalDexData)) {
        if(Region === "Central Kalos" || Region === "Costal Kalos" || Region === "Mountain Kalos"){
            if(Region === "Central Kalos"){
                document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h2'),{innerHTML: "Kalos", className: 'GenerationHeaders'}));
            }
            document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Region, className: 'GenerationHeaders3'}));
        }else if(Region === "Melemele" || Region === "Akala" || Region === "Ula'ula" ||Region === "Poni"){
            if(Region === "Melemele"){
                document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h2'),{innerHTML: "Alola", className: 'GenerationHeaders'}));
            }
            document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Region, className: "GenerationHeaders3"}));

        }else if(Region === "Isle of Armor" || Region === "Crown Tundra" || Region === "Other"){
            document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Region, className: "GenerationHeaders3"}));
        }else{
            document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h2'),{innerHTML: Region, className: "GenerationHeaders"}));
        }
        for (const [key, value] of Object.entries(Dex)) {
            createListEntry("assets/media/" + imageGeneration(PokemonData[key]) + "/" + PokemonData[key] + ".png", document.getElementById('mainWrapper'), PokemonData[key] + ".png", key, "regional")
        }  
    }   
}else if(configsData.Dextype === "national"){
    ImageFileArray.forEach(element => {
        for (let [key, value] of Object.entries(PokemonData)) {
            if(element.replace(/\D/g,'').substring(1) === value){
                createListEntry(element, document.getElementById('mainWrapper'), element.slice(element.lastIndexOf("/")).replace("/", ""), key, "national")
            }
        }
    });
}

function shakeAnimation(element, timeInSec) {
    element.style.animation = "shake " + timeInSec + "s";
    setTimeout(() => {
        element.style = ""; 
    }, timeInSec*1000)
}
document.getElementById('settingsBTN').addEventListener('click', () => {
    document.getElementById(configsData.Dextype).setAttribute('selected', 'selected')
    emptySearch()
    ShowHideWrapper('hide', "show", 'hide', 'hide', 'hide', "hide")
})
document.getElementById('searchBTN').addEventListener('click', () => {
    if(document.getElementById("NorR").value != configsData.Dextype){
        shakeAnimation(document.getElementById("saveSettings"), 0.5)
    }else{
        emptySearch()
        ShowHideWrapper('hide', "hide", 'hide', 'show', 'hide', "hide")
    }
})
document.getElementById('pokedexBTN').addEventListener('click', () => {
    if(document.getElementById("NorR").value != configsData.Dextype){
        shakeAnimation(document.getElementById("saveSettings"), 0.5)
    }else{
        emptySearch()
        ShowHideWrapper('hide', "hide", 'show', 'hide', 'hide', 'hide')   
    }
})
document.getElementById('backBTN').addEventListener('click', () => {
    if(document.getElementById("NorR").value != configsData.Dextype){
        shakeAnimation(document.getElementById("saveSettings"), 0.5)
    }else{
        emptySearch()
        ShowHideWrapper('hide', "hide", 'hide', 'show', 'hide', 'hide')
    }
})

document.getElementById("saveSettings").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("ConfirmBTN").className = "flex";
    document.getElementById("ConfirmBTNText").innerHTML = "Pokedex needs to restart to apply changes";
})

document.getElementById("OkayBTN").addEventListener('click', () => {
    let jsonData = '{"Dextype": "' + document.getElementById("NorR").value + '"}'
    ipcRenderer.send('SaveConfig', jsonData)
    ipcRenderer.on('SaveConfigReply', (event, reply) => {
        if(reply === true){
            ipcRenderer.send('RestartApp');
        }
    })
})

document.getElementById("CancelBTN").addEventListener('click', () => {
    document.getElementById("ConfirmBTN").className = "none";
})
function MaleOrFemaleVersion(FileName, PokemonName){
    if(ImageFileArray.includes("assets/media/" + imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/' + FileName) === false){
        if(ImageFileArray.includes("assets/media/" + imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/' + FileName.replace(".png", "-FemaleVersion.png"))){
            return FileName.replace(".png", "-FemaleVersion.png");
        }else if(ImageFileArray.includes("assets/media/" + imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/' + FileName.replace(".png", "-MaleVersion.png"))){
            return FileName.replace(".png", "-MaleVersion.png");
        }
    }else{
        return FileName
    }
}

function PreparePokemonPage(FileName, PokemonName){
    document.getElementById('pokemonImage').style.backgroundImage = 'url("assets/media/'+ imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/' + MaleOrFemaleVersion(FileName, PokemonName) + '")';
    document.getElementById('pokemonImage').dataset.imagefilename = FileName;
    InsertPokemonData(capitalizeFirstLetter(PokemonName));
}

document.getElementById('searchResults').addEventListener('click', (e) => {
    if(e.target !== document.getElementById('searchResults')){
        if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
            if(e.target.tagName === 'DIV'){
                PreparePokemonPage(e.target.parentNode.childNodes[1].alt, e.target.parentNode.childNodes[3].innerHTML)
            }else if(e.target.tagName === 'IMG'){
                PreparePokemonPage(e.target.alt, e.target.parentNode.childNodes[3].innerHTML)
            }else{
                PreparePokemonPage(e.target.childNodes[1].alt, e.target.childNodes[3].innerHTML)
            }
        }
    }
})

document.getElementById('searchResults').addEventListener('keypress', (e) => {
    if (e.code === "Enter" ) {
        if(e.target !== document.getElementById('searchResults')){
            if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
                PreparePokemonPage(e.target.childNodes[1].alt, e.target.childNodes[3].innerHTML)
            }
        }
    }
})
document.getElementById('mainWrapper').addEventListener('click', (e) => {
    if(e.target.tagName === "LI"){
        PreparePokemonPage(e.target.childNodes[0].alt, e.target.childNodes[1].innerHTML)
    }
    else if(e.target.tagName === "IMG"){
        PreparePokemonPage(e.target.parentNode.childNodes[0].alt, e.target.parentNode.childNodes[1].innerHTML)
    }
    else if(e.target.tagName === "P"){
        PreparePokemonPage(e.target.parentNode.childNodes[0].alt, e.target.parentNode.childNodes[1].innerHTML)
    }
})
document.getElementById('mainWrapper').addEventListener('keypress', (e) => {
    if (e.code === "Enter" ) {
        if(e.target.tagName === "LI"){
            PreparePokemonPage(e.target.childNodes[0].alt, e.target.childNodes[1].innerHTML)
        }
    }
})

document.getElementById("evolution-wrapper").addEventListener('click', (e) => {
    if(e.target.tagName === "P" || e.target.tagName === "IMG" ){
        if(e.target.className != "EvoSteps"){
            document.getElementById("pokemonImage").scrollTo(0,0)
            PreparePokemonPage(e.target.dataset.pokemonimg, e.target.dataset.pokemonname)
        }
    }
})