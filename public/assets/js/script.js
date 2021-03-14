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
function MaleOrFemaleVersion(FileName, PokemonName, Shiny=false){
    FileName = FileName.replace("-Shiny", "");
    if(ImageFileArray.includes("assets/media/" + imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/' + FileName) === false){
        if(ImageFileArray.includes("assets/media/" + imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/' + FileName.replace(".png", "-FemaleVersion.png"))){
            if(Shiny === true){
                return FileName.replace(".png", "-FemaleVersion-Shiny.png");
            }else{
                return FileName.replace(".png", "-FemaleVersion.png");
            }
        }else if(ImageFileArray.includes("assets/media/" + imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/' + FileName.replace(".png", "-MaleVersion.png"))){
            if(Shiny === true){
                return FileName.replace(".png", "-MaleVersion-Shiny.png");
            }else{
                return FileName.replace(".png", "-MaleVersion.png");
            }
        }
    }else{
        if(Shiny === true){
            return FileName.replace(".png", "-Shiny.png");
        }else{
            return FileName
        }
    }
}

function PreparePokemonPage(FileName, PokemonName){
    if(FileName.includes("Shiny")){
        if(FileName.includes("Alolan")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url("assets/media/'+ imageGeneration(PokemonData[PokemonName.replace("Alolan ","").toLowerCase()]) + '/variants/shiny/' + FileName + '")';
        }else if(FileName.includes("Galarian")){
            document.getElementById('pokemonImage').style.backgroundImage = 'url("assets/media/'+ imageGeneration(PokemonData[PokemonName.replace("Galarian ","").toLowerCase()]) + '/variants/shiny/' + FileName + '")';
        }else{
            document.getElementById('pokemonImage').style.backgroundImage = 'url("assets/media/'+ imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/shiny/' + MaleOrFemaleVersion(FileName, PokemonName, true) + '")';
        }
    }else if(FileName.includes("Alolan")){
        document.getElementById('pokemonImage').style.backgroundImage = 'url("assets/media/'+ imageGeneration(PokemonData[PokemonName.replace("Alolan ","").toLowerCase()]) + '/variants/' + FileName + '")';
    }else if(FileName.includes("Galarian")){
        document.getElementById('pokemonImage').style.backgroundImage = 'url("assets/media/'+ imageGeneration(PokemonData[PokemonName.replace("Galarian ","").toLowerCase()]) + '/variants/' + FileName + '")';
    }else{
        document.getElementById('pokemonImage').style.backgroundImage = 'url("assets/media/'+ imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/' + MaleOrFemaleVersion(FileName, PokemonName) + '")';
    }
    document.getElementById('pokemonImage').dataset.pokemonname = PokemonName;
    document.getElementById('pokemonImage').dataset.imagefilename = FileName;
    InsertPokemonData(capitalizeFirstLetter(PokemonName));
}

function createListEntry(src, dom, file, Name, PokeDexType, display="flex"){
    div = Object.assign(document.createElement("li"), {className: "pokemon navigate " + display})
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
    }else if(ImageFileArray.includes(src.replace(".png", "-MaleVersion.png"))){
        image.src = src.replace(".png", "-MaleVersion.png")
    }else if(src.includes("shiny")){
        image.src = src;
        if(ImageFileArray.includes(src.replace("shiny/", "").replace("-Shiny", "").replace(".png", "-FemaleVersion.png"))){
            image.src = src.replace("-Shiny", "").replace(".png", "-FemaleVersion-Shiny.png");
        }else if(ImageFileArray.includes(src.replace("shiny/", "").replace("-Shiny", "").replace(".png", "-MaleVersion.png"))){
            image.src = src.replace("-Shiny", "").replace(".png", "-MaleVersion-Shiny.png")
        }
    }else if(VariantsImageArray.includes(src)){
        image.src = src
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

function ShowHideWrapper(pokemonImage, settingsWrapper, mainWrapper, mainWrapperShiny, searchWrapper, circleWrapper, loading){
    FlexNone(settingsWrapper, document.getElementById('settingsWrapper'), "settings-wrapper")
    FlexNone(pokemonImage, document.getElementById('pokemonImage'))
    FlexNone(mainWrapper, document.getElementById('mainWrapper'), 'pokedex-wrapper')
    FlexNone(mainWrapperShiny, document.getElementById('mainWrapperShiny'), 'pokedex-wrapper')
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
            if(LoadVariantsData["alolan " + element] != undefined){
                tempArray.push(element + " alolan")
            }
            if(LoadVariantsData["galarian " + element] != undefined){
                tempArray.push(element + " galarian")
            }
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
            if(tempArray[i - 1].includes("alolan")){
                tempArray[i - 1] = "alolan " + tempArray[i - 1].replace("alolan", "")
            }else if(tempArray[i - 1].includes("galarian")){
                tempArray[i - 1] = "galarian " + tempArray[i - 1].replace("galarian", "")
            }
            document.getElementById('Showresult' + i).innerHTML = tempArray[i - 1];
            if(document.getElementById("shinyBTN").className === "ShowShiny"){
                if(tempArray[i - 1].includes("alolan")){
                    PokemonNameWithoutRegion = tempArray[i - 1].replace("alolan ", "")
                    document.getElementById('imageresult' + i).src = "assets/media/" + imageGeneration(PokemonData[tempArray[i - 1].replace("alolan ", "").replace(" ", "")]) + "/variants/shiny/" + PokemonData[tempArray[i - 1].replace("alolan ", "").replace(" ", "")] + "-Alolan-Shiny.png";
                    document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1].replace("alolan ", "").replace(" ", "")] + "-Alolan-Shiny.png";        
                }else if(tempArray[i - 1].includes("galarian")){
                    document.getElementById('imageresult' + i).src = "assets/media/" + imageGeneration(PokemonData[tempArray[i - 1].replace("galarian ", "").replace(" ", "")]) + "/variants/shiny/" + PokemonData[tempArray[i - 1].replace("galarian ", "").replace(" ", "")] + "-Galarian-Shiny.png";
                    document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1].replace("galarian ", "").replace(" ", "")] + "-Galarian-Shiny.png";        
                }else{
                    document.getElementById('imageresult' + i).src = "assets/media/" + imageGeneration(PokemonData[tempArray[i - 1]]) + "/shiny/" + MaleOrFemaleVersion(PokemonData[tempArray[i - 1]] + ".png", tempArray[i - 1], true);
                    document.getElementById('imageresult' + i).alt = MaleOrFemaleVersion(PokemonData[tempArray[i - 1]] + ".png", tempArray[i - 1], true);        
                }
            }else{
                if(tempArray[i - 1].includes("alolan")){
                    PokemonNameWithoutRegion = tempArray[i - 1].replace("alolan ", "")
                    document.getElementById('imageresult' + i).src = "assets/media/" + imageGeneration(PokemonData[tempArray[i - 1].replace("alolan ", "").replace(" ", "")]) + "/variants/" + PokemonData[tempArray[i - 1].replace("alolan ", "").replace(" ", "")] + "-Alolan.png";
                    document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1].replace("alolan ", "").replace(" ", "")] + "-Alolan.png";        
                }else if(tempArray[i - 1].includes("galarian")){
                    document.getElementById('imageresult' + i).src = "assets/media/" + imageGeneration(PokemonData[tempArray[i - 1].replace("galarian ", "").replace(" ", "")]) + "/variants/" + PokemonData[tempArray[i - 1].replace("galarian ", "").replace(" ", "")] + "-Galarian.png";
                    document.getElementById('imageresult' + i).alt = PokemonData[tempArray[i - 1].replace("galarian ", "").replace(" ", "")] + "-Galarian.png";        
                }else{
                    document.getElementById('imageresult' + i).src = "assets/media/" + imageGeneration(PokemonData[tempArray[i - 1]]) + "/" + MaleOrFemaleVersion(PokemonData[tempArray[i - 1]] + ".png", tempArray[i - 1]);
                    document.getElementById('imageresult' + i).alt = MaleOrFemaleVersion(PokemonData[tempArray[i - 1]] + ".png", tempArray[i - 1]);    
                }
            }
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
            if(document.getElementById("shinyBTN").className === "ShowShiny"){
                if(Key.includes("Alolan")){
                    var ImgTag = Object.assign(document.createElement('img'), {
                        src: "assets/media/" + imageGeneration(PokemonData[Key.replace("Alolan ", "").toLowerCase()]) + "/variants/shiny/" + PokemonData[Key.replace("Alolan ", "").toLowerCase()] + "-Alolan-Shiny.png",
                        alt: EvolutionData[PokemonName][Key]["PokeDexIDs"] + ".png", 
                    });
                    ImgTag.dataset.pokemonimg = PokemonData[Key.replace("Alolan ", "").toLowerCase()] + "-Alolan.png";
                }else if(Key.includes("Galarian")){
                    var ImgTag = Object.assign(document.createElement('img'), {
                        src: "assets/media/" + imageGeneration(PokemonData[Key.replace("Galarian ", "").toLowerCase()]) + "/variants/shiny/" + PokemonData[Key.replace("Galarian ", "").toLowerCase()] + "-Galarian-Shiny.png",
                        alt: EvolutionData[PokemonName][Key]["PokeDexIDs"] + ".png", 
                    });
                    ImgTag.dataset.pokemonimg = PokemonData[Key.replace("Galarian ", "").toLowerCase()] + "-Galarian.png";
                }else{
                    var ImgTag = Object.assign(document.createElement('img'), {
                        src: "assets/media/" + imageGeneration(PokemonData[Key.toLowerCase()]) + "/shiny/" + MaleOrFemaleVersion(PokemonData[Key.toLowerCase()] + "-Shiny.png", Key, true),
                        alt: EvolutionData[PokemonName][Key]["PokeDexIDs"] + ".png", 
                    });  
                    ImgTag.dataset.pokemonimg = MaleOrFemaleVersion(PokemonData[Key.toLowerCase()] + ".png", Key, true);    
                }
            }else if(Key.includes("Alolan")){
                var ImgTag = Object.assign(document.createElement('img'), {
                    src: "assets/media/" + imageGeneration(PokemonData[Key.replace("Alolan ", "").toLowerCase()]) + "/variants/" + PokemonData[Key.replace("Alolan ", "").toLowerCase()] + "-Alolan.png",
                    alt: EvolutionData[PokemonName][Key]["PokeDexIDs"] + ".png", 
                });
                ImgTag.dataset.pokemonimg = PokemonData[Key.replace("Alolan ", "").toLowerCase()] + "-Alolan.png";
            }else if(Key.includes("Galarian")){
                var ImgTag = Object.assign(document.createElement('img'), {
                    src: "assets/media/" + imageGeneration(PokemonData[Key.replace("Galarian ", "").toLowerCase()]) + "/variants/" + PokemonData[Key.replace("Galarian ", "").toLowerCase()] + "-Galarian.png",
                    alt: EvolutionData[PokemonName][Key]["PokeDexIDs"] + ".png", 
                });
                ImgTag.dataset.pokemonimg = PokemonData[Key.replace("Galarian ", "").toLowerCase()] + "-Galarian.png";
            }
            else{
                var ImgTag = Object.assign(document.createElement('img'), {
                    src: "assets/media/" + imageGeneration(PokemonData[Key.toLowerCase()]) + "/" + MaleOrFemaleVersion(PokemonData[Key.toLowerCase()] + ".png", Key),
                    alt: EvolutionData[PokemonName][Key]["PokeDexIDs"] + ".png", 
                });
                ImgTag.dataset.pokemonimg = MaleOrFemaleVersion(PokemonData[Key.toLowerCase()] + ".png", Key);
            }
            
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
    ShowHideWrapper("hide", "hide", "hide", "hide", "hide", "hide", "show")
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
            ShowHideWrapper("show", "hide", "hide", "hide", "hide", "show", "hide")
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
VariantsImageArray = ipcRenderer.sendSync('LoadImagesVariants')
if(configsData.Dextype === "regional"){
    const RegionalDexData = JSON.parse(ipcRenderer.sendSync('LoadRegionalDex'));
    for (const [Region, Dex] of Object.entries(RegionalDexData)) {
        if(Region === "Central Kalos" || Region === "Costal Kalos" || Region === "Mountain Kalos"){
            if(Region === "Central Kalos"){
                document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h2'),{innerHTML: "Kalos", className: 'GenerationHeaders'}));
                document.getElementById("mainWrapperShiny").appendChild(Object.assign(document.createElement('h2'),{innerHTML: "Kalos", className: 'GenerationHeaders'}));
            }
            document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Region, className: 'GenerationHeaders3'}));
            document.getElementById("mainWrapperShiny").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Region, className: 'GenerationHeaders3'}));
        }else if(Region === "Melemele" || Region === "Akala" || Region === "Ula'ula" ||Region === "Poni"){
            if(Region === "Melemele"){
                document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h2'),{innerHTML: "Alola", className: 'GenerationHeaders'}));
                document.getElementById("mainWrapperShiny").appendChild(Object.assign(document.createElement('h2'),{innerHTML: "Alola", className: 'GenerationHeaders'}));
            }
            document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Region, className: "GenerationHeaders3"}));
            document.getElementById("mainWrapperShiny").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Region, className: "GenerationHeaders3"}));

        }else if(Region === "Isle of Armor" || Region === "Crown Tundra" || Region === "Other"){
            document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Region, className: "GenerationHeaders3"}));
            document.getElementById("mainWrapperShiny").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Region, className: "GenerationHeaders3"}));
        }else{
            document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h2'),{innerHTML: Region, className: "GenerationHeaders"}));
            document.getElementById("mainWrapperShiny").appendChild(Object.assign(document.createElement('h2'),{innerHTML: Region, className: "GenerationHeaders"}));
        }
        for (const [key, value] of Object.entries(Dex)) {
            if(Region === "Melemele" || Region === "Akala" || Region === "Ula'ula" ||Region === "Poni"){
                if(VariantsImageArray.includes("assets/media/" + imageGeneration(PokemonData[key]) + "/variants/" + PokemonData[key] + "-Alolan.png")){
                    let Src = "assets/media/" + imageGeneration(PokemonData[key]) + "/variants/" + PokemonData[key] + "-Alolan.png"
                    let File = PokemonData[key] + "-Alolan.png"
                    let Name = "Alolan " + key
                    createListEntry(Src, document.getElementById('mainWrapper'), File, Name, "regional", "flex")
                    createListEntry("assets/media/" + imageGeneration(PokemonData[key]) + "/variants/shiny/" + PokemonData[key] + "-Alolan-Shiny.png", document.getElementById('mainWrapperShiny'), PokemonData[key] + "-Alolan-Shiny.png", "Alolan " + key, "regional", "flex")        
                }else{
                    createListEntry("assets/media/" + imageGeneration(PokemonData[key]) + "/" + PokemonData[key] + ".png", document.getElementById('mainWrapper'), PokemonData[key] + ".png", key, "regional")
                    createListEntry("assets/media/" + imageGeneration(PokemonData[key]) + "/shiny/" + PokemonData[key] + "-Shiny.png", document.getElementById('mainWrapperShiny'), PokemonData[key] + "-Shiny.png", key, "regional", "flex")        
                }
            }else if(Region === "Galar" || Region === "Isle of Armor" || Region === "Crown Tundra" || Region === "Other"){
                if(VariantsImageArray.includes("assets/media/" + imageGeneration(PokemonData[key]) + "/variants/" + PokemonData[key] + "-Galarian.png")){
                    let Src = "assets/media/" + imageGeneration(PokemonData[key]) + "/variants/" + PokemonData[key] + "-Galarian.png"
                    let File = PokemonData[key] + "-Galarian.png"
                    let Name = "Galarian " + key
                    createListEntry(Src, document.getElementById('mainWrapper'), File, Name, "regional", "flex")
                    createListEntry("assets/media/" + imageGeneration(PokemonData[key]) + "/variants/shiny/" + PokemonData[key] + "-Galarian-Shiny.png", document.getElementById('mainWrapperShiny'), PokemonData[key] + "-Galarian-Shiny.png", "Galarian " + key, "regional", "flex")        
                }else{
                    createListEntry("assets/media/" + imageGeneration(PokemonData[key]) + "/" + PokemonData[key] + ".png", document.getElementById('mainWrapper'), PokemonData[key] + ".png", key, "regional")
                    createListEntry("assets/media/" + imageGeneration(PokemonData[key]) + "/shiny/" + PokemonData[key] + "-Shiny.png", document.getElementById('mainWrapperShiny'), PokemonData[key] + "-Shiny.png", key, "regional", "flex")        
                }
            }else{
                createListEntry("assets/media/" + imageGeneration(PokemonData[key]) + "/" + PokemonData[key] + ".png", document.getElementById('mainWrapper'), PokemonData[key] + ".png", key, "regional")
                createListEntry("assets/media/" + imageGeneration(PokemonData[key]) + "/shiny/" + PokemonData[key] + "-Shiny.png", document.getElementById('mainWrapperShiny'), PokemonData[key] + "-Shiny.png", key, "regional", "flex")    
            }
        }  
    }   
}else if(configsData.Dextype === "national"){
    ImageFileArray.forEach(element => {
        for (let [key, value] of Object.entries(PokemonData)) {
            if(element.replace(/\D/g,'').substring(1) === value){
                FileName = value + ".png"
                createListEntry("assets/media/" + imageGeneration(value) + "/" + FileName, document.getElementById('mainWrapper'), FileName, key, "national")
                createListEntry("assets/media/" + imageGeneration(value) + "/shiny/" + FileName.replace(".png", "-Shiny.png"), document.getElementById('mainWrapperShiny'), FileName.replace(".png", "-Shiny.png"), key, "national", true)
                if(VariantsImageArray.includes("assets/media/" + imageGeneration(value) + "/variants/" + FileName.replace(".png", "-Alolan.png"))){
                    createListEntry("assets/media/" + imageGeneration(value) + "/variants/" + FileName.replace(".png", "-Alolan.png"), document.getElementById('mainWrapper'), FileName.replace(".png", "-Alolan.png"), "Alolan " + key, "national")
                    createListEntry("assets/media/" + imageGeneration(value) + "/variants/shiny/" + FileName.replace(".png", "-Alolan-Shiny.png"), document.getElementById('mainWrapperShiny'), FileName.replace(".png", "-Alolan-Shiny.png"), "Alolan " + key, "national", true)
                }
                if(VariantsImageArray.includes("assets/media/" + imageGeneration(value) + "/variants/" + FileName.replace(".png", "-Galarian.png"))){
                    createListEntry("assets/media/" + imageGeneration(value) + "/variants/" + FileName.replace(".png", "-Galarian.png"), document.getElementById('mainWrapper'), FileName.replace(".png", "-Galarian.png"), "Galarian " + key, "national")
                    createListEntry("assets/media/" + imageGeneration(value) + "/variants/shiny/" + FileName.replace(".png", "-Galarian-Shiny.png"), document.getElementById('mainWrapperShiny'), FileName.replace(".png", "-Galarian-Shiny.png"), "Galarian " + key, "national", true)
                }            
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

document.getElementById('shinyBTN').addEventListener('click', () => {
    if(document.getElementById("mainWrapper").className === "flex pokedex-wrapper" || document.getElementById("mainWrapperShiny").className === "flex pokedex-wrapper"){
        if(document.getElementById("shinyBTN").className === "HideShiny"){   
            document.getElementById("shinyBTN").className = "ShowShiny";
            ScrollPoint = document.getElementById("mainWrapper").scrollTop

            document.getElementById("mainWrapper").className = "none pokedex-wrapper";
            document.getElementById("mainWrapperShiny").className = "flex pokedex-wrapper";
            document.getElementById("mainWrapperShiny").scrollTo(0,ScrollPoint)

        }else if(document.getElementById("shinyBTN").className === "ShowShiny"){
            document.getElementById("shinyBTN").className = "HideShiny";
            ScrollPoint = document.getElementById("mainWrapperShiny").scrollTop

            document.getElementById("mainWrapper").className = "flex pokedex-wrapper";
            document.getElementById("mainWrapperShiny").className = "none pokedex-wrapper";
            document.getElementById("mainWrapper").scrollTo(0,ScrollPoint)

        }

    }else if(document.getElementById("pokemonImage").className === "flex "){
        if(document.getElementById("shinyBTN").className === "HideShiny"){   
            document.getElementById("shinyBTN").className = "ShowShiny";
            for (let Pokemon of document.getElementsByClassName("pokemon-evo")) {
                let DexID = Pokemon.getElementsByTagName("img")[0].alt.replace(".png", "")
                let PokemonName = Pokemon.getElementsByTagName("img")[0].dataset.pokemonname
                if(PokemonName.includes("Alolan")){
                    let FileName = Pokemon.getElementsByTagName("img")[0].alt.replace(".png", "-Alolan-Shiny.png")
                    Pokemon.getElementsByTagName("img")[0].src = "assets/media/" + imageGeneration(DexID) + "/variants/shiny/" + FileName;
                }else if(PokemonName.includes("Galarian")){
                    let FileName = Pokemon.getElementsByTagName("img")[0].alt.replace(".png", "-Galarian-Shiny.png");
                    Pokemon.getElementsByTagName("img")[0].src = "assets/media/" + imageGeneration(DexID) + "/variants/shiny/" + FileName;
                }else {
                    let FileName = Pokemon.getElementsByTagName("img")[0].alt.replace(".png", "-Shiny.png")
                    Pokemon.getElementsByTagName("img")[0].src = "assets/media/" + imageGeneration(DexID) + "/shiny/" + MaleOrFemaleVersion(FileName, PokemonName, true);
                }
            }
            let DexID = document.getElementById("pokemonImage").dataset.imagefilename.replace(".png", "").replace("-Shiny", "")
            let FileName = document.getElementById("pokemonImage").dataset.imagefilename
            let PokemonName = document.getElementById("pokemonImage").dataset.pokemonname
            if(PokemonName.includes("Alolan") || PokemonName.includes("Galarian")){
                FileName = FileName.replace("-Shiny", "")
                document.getElementById("pokemonImage").style.backgroundImage = "url(assets/media/" + imageGeneration(DexID) + "/variants/shiny/" + FileName.replace(".png", "-Shiny.png") + ")";
            }else {
                document.getElementById("pokemonImage").style.backgroundImage = "url(assets/media/" + imageGeneration(DexID) + "/shiny/" + MaleOrFemaleVersion(FileName, PokemonName, true) + ")";
            }
        }else if(document.getElementById("shinyBTN").className === "ShowShiny"){
            for (let Pokemon of document.getElementsByClassName("pokemon-evo")) {
                let DexID = Pokemon.getElementsByTagName("img")[0].alt.replace(".png", "")
                let PokemonName = Pokemon.getElementsByTagName("img")[0].dataset.pokemonname
                if(PokemonName.includes("Alolan")){
                    let FileName = Pokemon.getElementsByTagName("img")[0].alt.replace(".png", "-Alolan.png")
                    Pokemon.getElementsByTagName("img")[0].src = "assets/media/" + imageGeneration(DexID) + "/variants/" + FileName;    
                }else if(PokemonName.includes("Galarian")){
                    let FileName = Pokemon.getElementsByTagName("img")[0].alt.replace(".png", "-Galarian.png")
                    Pokemon.getElementsByTagName("img")[0].src = "assets/media/" + imageGeneration(DexID) + "/variants/" + FileName;    
                }else{
                    let FileName = Pokemon.getElementsByTagName("img")[0].alt.replace(".png", "-Shiny.png")
                    Pokemon.getElementsByTagName("img")[0].src = "assets/media/" + imageGeneration(DexID) + "/" + MaleOrFemaleVersion(FileName, PokemonName, false);    
                }
            }
            let DexID = document.getElementById("pokemonImage").dataset.imagefilename.replace(".png", "").replace("-Shiny", "");
            let FileName = document.getElementById("pokemonImage").dataset.imagefilename.replace("-Shiny", "");
            let PokemonName = document.getElementById("pokemonImage").dataset.pokemonname
            if(PokemonName.includes("Alolan") || PokemonName.includes("Galarian")){
                document.getElementById("pokemonImage").style.backgroundImage = "url(assets/media/" + imageGeneration(DexID) + "/variants/" + FileName + ")"
            }else {
                document.getElementById("pokemonImage").style.backgroundImage = "url(assets/media/" + imageGeneration(DexID) + "/" + MaleOrFemaleVersion(FileName, PokemonName, false) + ")"
            }
            document.getElementById("shinyBTN").className = "HideShiny";
        }
    }else if(document.getElementById("searchWrapper").className === "flex search-wrapper" || document.getElementById("searchWrapper").className === "search-wrapper"){
        if(document.getElementById("shinyBTN").className === "HideShiny"){   
            document.getElementById("shinyBTN").className = "ShowShiny";
        }else if(document.getElementById("shinyBTN").className === "ShowShiny"){
            document.getElementById("shinyBTN").className = "HideShiny";
        }
    }
    emptySearch()
})
/*          Menu            */
document.getElementById('settingsBTN').addEventListener('click', () => {
    document.getElementById(configsData.Dextype).setAttribute('selected', 'selected')
    emptySearch()
    ShowHideWrapper('hide', "show", 'hide', 'hide', 'hide', 'hide', "hide")
})
document.getElementById('searchBTN').addEventListener('click', () => {
    if(document.getElementById("NorR").value != configsData.Dextype){
        shakeAnimation(document.getElementById("saveSettings"), 0.5)
    }else{
        emptySearch()
        ShowHideWrapper('hide', "hide", 'hide', 'hide', 'show', 'hide', "hide")
    }
})
document.getElementById('pokedexBTN').addEventListener('click', () => {
    if(document.getElementById("NorR").value != configsData.Dextype){
        shakeAnimation(document.getElementById("saveSettings"), 0.5)
    }else{
        emptySearch()
        if(document.getElementById("shinyBTN").className ==="ShowShiny"){
            ShowHideWrapper('hide', "hide", "hide", 'show', 'hide', 'hide', 'hide')   
        }else if(document.getElementById("shinyBTN").className === "HideShiny"){
            ShowHideWrapper('hide', "hide", "show", 'hide', 'hide', 'hide', 'hide')   
        }
    }
})
document.getElementById('backBTN').addEventListener('click', () => {
    if(document.getElementById("NorR").value != configsData.Dextype){
        shakeAnimation(document.getElementById("saveSettings"), 0.5)
    }else{
        emptySearch()
        ShowHideWrapper('hide', "hide", 'hide', 'hide', 'show', 'hide', 'hide')
    }
})
/*          Menu            */

/*          Settings            */
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
/*          Settings            */

/*          Search            */
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
NormalAndShinyWrapper = ["mainWrapper", "mainWrapperShiny"]
NormalAndShinyWrapper.forEach(element => {
    document.getElementById(element).addEventListener('click', (e) => {
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
    document.getElementById(element).addEventListener('keypress', (e) => {
        if (e.code === "Enter" ) {
            if(e.target.tagName === "LI"){
                PreparePokemonPage(e.target.childNodes[0].alt, e.target.childNodes[1].innerHTML)
            }
        }
    })
});

document.getElementById("evolution-wrapper").addEventListener('click', (e) => {
    if(e.target.tagName === "P" || e.target.tagName === "IMG" ){
        if(e.target.className != "EvoSteps"){
            document.getElementById("pokemonImage").scrollTo(0,0)
            if(document.getElementById("shinyBTN").className === "ShowShiny"){
                PreparePokemonPage(e.target.dataset.pokemonimg.replace(".png", "-Shiny.png"), e.target.dataset.pokemonname)
            }else{
                PreparePokemonPage(e.target.dataset.pokemonimg, e.target.dataset.pokemonname)
            }
        }
    }
})