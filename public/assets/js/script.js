const { ipcRenderer } = require('electron');
const configsData = JSON.parse(ipcRenderer.sendSync('LoadConfig'));
const LoadVariantsData = JSON.parse(ipcRenderer.sendSync('LoadVariants'));
const PokemonData = JSON.parse(ipcRenderer.sendSync('LoadPokedex'));
const PokemonDataKeys = Object.keys(PokemonData);
const EvolutionData = JSON.parse(ipcRenderer.sendSync('LoadEvolution'));
const TypeColorData = JSON.parse(ipcRenderer.sendSync('LoadTypeColor'));
const Variants = {
    "deoxys": ["normal", "attack", "defense", "speed"],
    "giratina": ["altered", "origin"],
    "shaymin": ["land","sky"],
    "basculin": ["red-striped","blue-striped"],
    "darmanitan": ["standard","zen"],
    "galarian darmanitan": ["standard-galar","zen-galar"],
    "tornadus": ["incarnate","therian"],
    "thundurus": ["incarnate","therian"],
    "landorus": ["incarnate","therian"],
    "keldeo": ["ordinary","resolute"],
    "meloetta": ["aria","pirouette"],
    "zacian": ["hero","crowned"],
    "zamazenta": ["hero","crowned"],
    "urshifu": ["single-strike","rapid-strike"],
};
document.getElementById("NorR").value = configsData.Dextype;

document.getElementById('closeBTN').addEventListener('click', closeWindow);
document.getElementById('minimizeBTN').addEventListener('click', minimizeWindow);
document.getElementById('maximizeBTN').addEventListener('click', maximizeWindow);
document.getElementById('search').addEventListener('keyup', search);

/*          Function to show/hide a elements            */
function FlexNone(TempElement, ShowOrHide){
    ClassName = TempElement.className.replaceAll("none", "").replace("flex", "").replaceAll(" ", "");
    if(ShowOrHide === "hide"){
        if(ClassName === ""){
            TempElement.className = "none";
        }else{
            TempElement.className = ClassName + " none";
        }
    }else if(ShowOrHide == "show"){
        if(ClassName === ""){
            TempElement.className = "flex";
        }else{
            TempElement.className = ClassName + " flex";
        }
    }
}; 

/*          Functions that calls main.js and closes, minimizes or maximizes the pokedex window             */
function closeWindow(){
    ipcRenderer.send('CloseWindow');
};
function minimizeWindow(){
    ipcRenderer.send('MinimizeWindow');
};
function maximizeWindow(){
    ipcRenderer.send('MaximizeWindow');
};

/*          Capitalizes the first letter of the string            */
function capitalizeFirstLetter(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

/*          Returns a string with the generation that a certain pokedex id falls under            */
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
};

/*          A function that returns the correct filename             */
function MaleOrFemaleVersion(FileName, PokemonName, Shiny=false){
    FileName = FileName.replace("-Shiny", "");
    if(FileName.toLowerCase().includes("alolan") || FileName.toLowerCase().includes("galarian") || PokemonName.includes("(")){
        if(Shiny === true){
            return FileName.replace(".png", "-Shiny.png");
        }else{
            return FileName;
        }
    }else if(ImageFileArray.includes("assets/media/" + imageGeneration(PokemonData[PokemonName.toLowerCase()]) + '/' + FileName) === false){
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
            return FileName;
        }
    }
};
/*          A function that prepares the Pokemon page and then calls GatherPokemonDataFromAPI           */
function PreparePokemonPage(FileName, PokemonName, Shiny = false){
    let Data = GetPokemonDataFromName(PokemonName);
    if(FileName.includes("Shiny") || Shiny === true){
        document.getElementById('pokemonImage').style.backgroundImage = "url(" + Data.ShinyLink + ")";
        document.getElementById('pokemonImage').dataset.filename = Data.ShinyFileName;
        document.getElementById('pokemonImage').dataset.shiny = "true";
    }else{
        document.getElementById('pokemonImage').style.backgroundImage = "url(" + Data.Link + ")";
        document.getElementById('pokemonImage').dataset.filename = Data.FileName;
        document.getElementById('pokemonImage').dataset.shiny = "false";
    }
    document.getElementById('pokemonImage').dataset.pokemonname = Data.PokemonName;
    GatherPokemonDataFromAPI(PokemonName);
};

/*          Create pokemon elements and splits them up with a generation header           */
function createListEntry(link, FileName, dom, Name, PokeDexType, Shiny=false,display="flex"){
    div = Object.assign(document.createElement("li"), {className: "pokemon navigate " + display});
    image = document.createElement("img");
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
        };
        if(GenerationsOBJ[PokemonData[Name.toLowerCase()]] != undefined){
            Header2 = Object.assign(document.createElement("h2"), {className: "GenerationHeaders", innerHTML: GenerationsOBJ[PokemonData[Name.toLowerCase()]]});
            dom.appendChild(Header2);
        }
    }
    text = Object.assign(document.createElement("p"), {innerHTML: Name});
    image.src = link;
    image.alt = FileName;
    image.dataset.filename = FileName;
    image.dataset.shiny = Shiny;

    div.appendChild(image);
    div.appendChild(text);
    dom.appendChild(div);
};

/*          Clears the search input field           */
function emptySearch(){
    document.getElementById('search').value = "";
    search();
};
/*          Displays or hides            */
function ShowHideWrapper(Elements){
    let DisplayObject = {
        "pokemonImage": "hide",
        "settingsWrapper": "hide",
        "mainWrapper": "hide",
        "mainWrapperShiny": "hide",
        "searchWrapper": "hide",
        "circleWrapper": "hide",
        "loading": "hide",
    };
    const CombinedObject = Object.assign(DisplayObject, Elements);
    for (const [ID, ShowOrHide] of Object.entries(CombinedObject)) {
        FlexNone(document.getElementById(ID), ShowOrHide);
    };
};

function search(){
    tempArray = [];
    searchValue = document.getElementById('search').value.toLowerCase();
    PokemonDataKeys.forEach(function(element){
        if(element.toLowerCase().startsWith(searchValue)){
            tempArray.push(element);
            if(LoadVariantsData["alolan " + element] != undefined){
                tempArray.push(element + " alolan");
            }
            if(LoadVariantsData["galarian " + element] != undefined){
                tempArray.push(element + " galarian");
            }
        }
    });
    tempArray = tempArray.sort();
    for(i = 1; i <= 5; i++){
        if(searchValue.length == 0){
            FlexNone(document.getElementById('result' + i), "hide");
        }
        else if(typeof tempArray[i - 1] === 'undefined'){
            FlexNone(document.getElementById('result' + i), "hide");
        }else{
            /*          Renames the file after it's added to the tempArray so that it'll show after the normal variant          */
            if(tempArray[i - 1].includes("alolan")){
                tempArray[i - 1] = "alolan " + tempArray[i - 1].replace(" alolan", "");
            }else if(tempArray[i - 1].includes("galarian")){
                tempArray[i - 1] = "galarian " + tempArray[i - 1].replace(" galarian", "");
            }
            /*          Renames the file after it's added to the tempArray so that it'll show after the normal variant          */

            document.getElementById('Showresult' + i).innerHTML = tempArray[i - 1];
            if(document.getElementById("shinyBTN").className === "ShowShiny"){
                let Data = GetPokemonDataFromName(tempArray[i - 1]);
                document.getElementById('imageresult' + i).src = Data.ShinyLink;
                document.getElementById('imageresult' + i).alt = Data.ShinyFileName;        
            }else{
                let Data = GetPokemonDataFromName(tempArray[i - 1]);
                document.getElementById('imageresult' + i).src = Data.Link;
                document.getElementById('imageresult' + i).alt = Data.FileName;  
            }
            FlexNone(document.getElementById('result' + i), "show");
        }
    }
};
function GetPokemonDataFromName(PokemonName){
    try{
        SpecialCases = {
            "galarian darmanitan": "555-Standard-Galarian"
        };
        if(PokemonName.includes("(")){
            var VariationsName = PokemonName.split(" (")[1].replace(")", "")
        }
        PokemonName = PokemonName.toLowerCase();
        PokemonNameWithoutRegion = PokemonName.replace("alolan ", "").replace("galarian ", "").split(" (")[0];
        let DexID = PokemonData[PokemonNameWithoutRegion.toLowerCase()];
        if(PokemonName.includes("alolan") || PokemonName.includes("galarian") || VariationsName != undefined){
            var ShinyFolderStructure = "/variants/shiny/";
            var FolderStructure = "/variants/";
            if(LoadVariantsData[PokemonName]){
                if(SpecialCases[PokemonName]){
                    FileName = SpecialCases[PokemonName] + ".png";    
                }else{
                    Region = PokemonName.split(" ")[0];
                    FileName = LoadVariantsData[PokemonName] + "-" + Region[0].toUpperCase() + Region.slice(1) + ".png";    
                }
            }else if(VariationsName != undefined){
                FileName = DexID + "-" + VariationsName.replace(" ", "-") + ".png";
            }
        }else{
            var ShinyFolderStructure = "/shiny/";
            var FolderStructure = "/";
            var FileName = DexID + ".png";
        }
        let ShinyFinalFileName = MaleOrFemaleVersion(FileName, PokemonName, true);
        let FinalFileName = MaleOrFemaleVersion(FileName, PokemonName, false);
        let Generation = imageGeneration(DexID);

        let ShinyLink = "assets/media/" + Generation + ShinyFolderStructure + ShinyFinalFileName;
        let Link = "assets/media/" + Generation + FolderStructure + FinalFileName;
        var Obj = {
            "DexID": DexID,
            "PokemonName": capitalizeFirstLetter(PokemonName),
            "FileName": FinalFileName,
            "ShinyFileName": ShinyFinalFileName,
            "Generation": Generation,
            "Link": Link,
            "ShinyLink": ShinyLink
        };
        return Obj;
    }
    catch{
        return "error";
    }
};
function EvolutionLine(PokemonName){
    SpecialCases = {
        "Darmanitan (Standard)": "Darmanitan",
        "Galarian Darmanitan (Standard)": "Galarian Darmanitan"
    };
    if(SpecialCases[PokemonName]){
        PokemonName = SpecialCases[PokemonName];
    }
    document.getElementsByClassName("section-title")[0].className = "section-title flex";
    if(EvolutionData[PokemonName] != undefined){
        for (Key in EvolutionData[PokemonName]){
            let Data = GetPokemonDataFromName(Key)
            var DivWrapper = Object.assign(document.createElement('div'), {className: 'pokemon-evo'});
            var PokemonWrapper = Object.assign(document.createElement('div'), {className: 'EvoPokemon'});
            let PTag = Object.assign(document.createElement('p'), {innerHTML: Key});
            if(document.getElementById("pokemonImage").dataset.shiny === "true"){
                var ImgTag = Object.assign(document.createElement('img'), {
                    src: Data.ShinyLink,
                    alt: Data.ShinyFileName
                });
                ImgTag.dataset.pokemonimg = Data.ShinyFileName;
                ImgTag.dataset.shiny = "true";
                PTag.dataset.shiny = "true";
            }else{
                var ImgTag = Object.assign(document.createElement('img'), {
                    src: Data.Link,
                    alt: Data.FileName, 
                });
                ImgTag.dataset.pokemonimg = Data.FileName;
                ImgTag.dataset.shiny = "false";
                PTag.dataset.shiny = "false";
            }
            PokemonWrapper.appendChild(ImgTag);
            PokemonWrapper.appendChild(PTag);

            if(typeof EvolutionData[PokemonName][Key]["HowToEvolve"] === 'object' && EvolutionData[PokemonName][Key]["HowToEvolve"] !== null){
                MethodWrapper = Object.assign(document.createElement("div"));

                for (let [key, value] of Object.entries(EvolutionData[PokemonName][Key]["HowToEvolve"])) {
                    if(EvolutionData[PokemonName][Key]["HowToEvolve"] != "Final Form"){
                        let EvoMethod = Object.assign(document.createElement('div'));
                        let EvoMethodPTag = Object.assign(document.createElement('p'), {className: "EvoSteps", innerHTML: value});
                        EvoMethod.appendChild(EvoMethodPTag);
                        MethodWrapper.appendChild(EvoMethod);
                    }
                  }
                DivWrapper.appendChild(PokemonWrapper);
                DivWrapper.appendChild(MethodWrapper);
            }else{
                let EvoMethod = Object.assign(document.createElement('div'));
                let EvoMethodPTag = Object.assign(document.createElement('p'), {className: "EvoSteps"});
                if(EvolutionData[PokemonName][Key]["HowToEvolve"].toLowerCase() != "final form"){
                    EvoMethodPTag.innerHTML = EvolutionData[PokemonName][Key]["HowToEvolve"];
                }
                EvoMethod.appendChild(EvoMethodPTag);
                DivWrapper.appendChild(PokemonWrapper);
                DivWrapper.appendChild(EvoMethod);
            } 
            
            ImgTag.dataset.pokemonname = Key;
            ImgTag.dataset.dexid = EvolutionData[PokemonName][Key]["PokeDexIDs"];
            PTag.dataset.pokemonimg = ImgTag.dataset.pokemonimg;
            PTag.dataset.pokemonname = Key;
            PTag.dataset.dexid = EvolutionData[PokemonName][Key]["PokeDexIDs"];

            Stage = "Stage" + EvolutionData[PokemonName][Key]["EvolutionStage"];
            document.getElementById(Stage).append(DivWrapper);
        }
    }else{
        document.getElementsByClassName("section-title")[0].className = "section-title none";
    }
};
async function GatherPokemonDataFromAPI(PokemonName){
    SpecialCases = {
        "galarian darmanitan": "darmanitan-standard-galar"
    };
    PokemonName = PokemonName.toLowerCase();
    PokemonNameWithoutSpecialCharacters = PokemonName.replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u").replaceAll("ý", "y");

    ShowHideWrapper({"loading": "show"});
    DexID = PokemonData[PokemonName];
    var PokemonNameArray = [];
    if(Variants[PokemonName] != undefined){
        Variants[PokemonName].forEach(PokemonNameInVariants => {
            PokemonNameArray.push(PokemonName + "-" + PokemonNameInVariants);
        });
    }else{
        PokemonNameArray.push(PokemonNameWithoutSpecialCharacters);
    }
    var Element = PokemonNameArray[0];
    let PokemonNameForLink = Element.replace('.',"").replace(':',"").replace("'","").replaceAll(' ',"-").replace("♂", "-m").replace("♀", "-f").replace('(', '').replace(')', '');
    if(SpecialCases[PokemonName]){
        var endpoint = SpecialCases[PokemonName];
    }else if(PokemonNameForLink.includes('alolan')){
        var endpoint = PokemonNameForLink.toLowerCase().replace("'","").replace("alolan-","") + "-alola";
    }else if(PokemonNameForLink.includes('galarian')){
        var endpoint = PokemonNameForLink.toLowerCase().replace("'","").replace("galarian-","")  + "-galar";
    }else{
        if(!Number(PokemonData[PokemonNameForLink.toLowerCase()]) === NaN){
            var endpoint = Number(PokemonData[PokemonNameForLink.toLowerCase()]);
        }else{
            endpoint = PokemonNameForLink.toLowerCase();
        }
    }

    ipcRenderer.send('PokemonData', endpoint);
    ipcRenderer.on('PokemonDataReply', (event, Data) => {
        if(Data === "Error"){
            return "Error";
        }
        else{
            if(PokemonName != Element && PokemonNameWithoutSpecialCharacters != Element){
                let VariantName = " (" + Element.replace(PokemonName + "-", "").replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()).replaceAll("-", " ") + ")";
                InsertPokemonData(PokemonName + VariantName.replace(" galar", "").replace(" alola", ""), Data);
            }else{
                InsertPokemonData(PokemonName, Data);
            }
        }
    }) 
};

function GenerateStats(StatType, Stat){
    if(StatType === "HP"){
        document.getElementById(StatType + "-stat").innerHTML = Stat;
        document.getElementById(StatType + "-min-stat").innerHTML = Math.floor(0.01 * (2 * Stat + 0 + Math.floor(0.25 * 0)) * 100) + 100 + 10;
        document.getElementById(StatType + "-max-stat").innerHTML = Math.floor(Stat * 2 + 204);
    }else{
        document.getElementById(StatType + "-stat").innerHTML = Stat;
        document.getElementById(StatType + "-min-stat").innerHTML =  Math.floor(((0.01 * (2 * Stat + 0 + Math.floor(0.25 * 0)) * 100) + 5) * 0.9);
        document.getElementById(StatType + "-max-stat").innerHTML = Math.floor((Stat*2+5+31+63)*1.1);  
    }
    if(((Stat/255)*100) <= 33){
        document.getElementById(StatType + "-stat-bar").className = "progress stats-red";
        document.getElementById(StatType + "-stat-bar").style.width = ((Stat/255)*100) + "%";
    }else if(((Stat/255)*100) >= 33 && ((Stat/255)*100) <= 66){
        document.getElementById(StatType + "-stat-bar").className = "progress stats-yellow";
        document.getElementById(StatType + "-stat-bar").style.width = ((Stat/255)*100) + "%";
    }else if(((Stat/255)*100) > 66){
        document.getElementById(StatType + "-stat-bar").className = "progress stats-green";
        document.getElementById(StatType + "-stat-bar").style.width = ((Stat/255)*100) + "%";
    }
};

function InsertPokemonData(PokemonName, ApiData){
    let Data = GetPokemonDataFromName(PokemonName);
    if(PokemonName.includes("(")){
        var PokemonNameWithoutVariation = PokemonName.split(" (")[0];
    }
    document.getElementById('Name').innerHTML = Data.PokemonName;
    ApiData.PokemonSpecies.genera.forEach(element => {
        if(element.language.name === "en"){
            document.getElementById('Species').innerHTML = element.genus;
        }
    });

    if(Data.DexID != undefined){
        document.getElementById('DexID').innerHTML = "#" + Data.DexID;
    }else{
        document.getElementById('DexID').innerHTML = "#" + PokemonData[PokemonNameWithoutVariation];
    }
    document.getElementById('DexID').style.color = TypeColorData[ApiData.types[0].type.name];

    document.getElementById("st0").style.fill = TypeColorData[ApiData.types[0].type.name];
    let Abilities = ApiData.abilities;
    document.getElementById("Abilities").innerHTML = "<b>Abilities:</b> ";
    Abilities.forEach(Ability => {
        if(Ability.is_hidden === true){
            PokemonAbility = capitalizeFirstLetter(Ability.ability.name.replaceAll("-", " ")) + " (Hidden Ability)";
        }else{
            PokemonAbility = capitalizeFirstLetter(Ability.ability.name.replaceAll("-", " ")) + ", ";
        }
        document.getElementById("Abilities").appendChild(Object.assign(document.createElement('span'),{innerHTML: PokemonAbility, className: 'Abilities'}));
    });
    document.getElementById("type-wrapper").innerHTML = "";
    for (i = 0; i < ApiData["types"].length; i++) {
        let type = document.createElement("div"); 
        let typeIcon = document.createElement("div"); 
        let TypeIconImage = document.createElement("img"); 
        let typeName = document.createElement("span"); 

        type.className = "type";
        typeIcon.className = "type-icon ";
        typeName.className = "type-name";
        TypeIconImage.src = "assets/static/" + capitalizeFirstLetter(ApiData.types[i].type.name) + ".svg";
        type.appendChild(typeIcon);
        typeIcon.appendChild(TypeIconImage);
        type.appendChild(typeName);

        document.getElementById("type-wrapper").appendChild(type);
          
        typeIcon.style.backgroundColor = TypeColorData[ApiData.types[i].type.name];
        typeName.innerHTML = capitalizeFirstLetter(ApiData.types[i].type.name);
    }
    document.getElementById("Height").innerHTML = "<p><b>Height: </b></p><p>" + (ApiData.height/10) + "m</p>";
    document.getElementById("Weight").innerHTML = "<p><b>Weight: </b></p><p>" + (ApiData.weight/10) + "kg</p>";
    let Stats = ["HP", "Attack", "Defense", "Special-Attack", "Special-Defense", "Speed"];
    for(i = 0; i < Stats.length; i++){
        GenerateStats(Stats[i], ApiData.stats[i].base_stat);
        document.getElementById("Total-stat").innerHTML = ApiData.stats[0].base_stat + ApiData.stats[1].base_stat + ApiData.stats[2].base_stat + ApiData.stats[3].base_stat + ApiData.stats[4].base_stat + ApiData.stats[5].base_stat;
    };
    EVYieldElement = "<ul><li> HP: " + ApiData.stats[0].effort + "</li><li> Atk: " + ApiData.stats[1].effort + "</li><li> Def: " + ApiData.stats[2].effort + "</li><li> Sp. Atk: " + ApiData.stats[3].effort + "</li><li> Sp. Def: " + ApiData.stats[4].effort + "</li><li> Spe: " + ApiData.stats[5].effort + "</li></ul>";
    document.getElementById("training-wrapper").innerHTML = "";
    document.getElementById("training-wrapper").appendChild(Object.assign(document.createElement('p'),{innerHTML: "<b>EV yield:</b>" + EVYieldElement, className: 'EVYield'}));
    document.getElementById("training-wrapper").appendChild(Object.assign(document.createElement('p'),{innerHTML: "<b>Base Experience: </b>" + "<p>" + ApiData.base_experience + "</p>", className: 'EVYield'}));
    document.getElementById("training-wrapper").appendChild(Object.assign(document.createElement('p'),{innerHTML: "<b>Base Happiness: </b>" + "<p>" + ApiData.PokemonSpecies.base_happiness + "</p>", className: 'EVYield'}));

    for(i = 0; i < 3; i++){
        document.getElementsByClassName('evolution-wrapper')[i].childNodes[1].innerHTML = "";
        document.getElementsByClassName('evolution-wrapper')[i].childNodes[3].innerHTML = "";
        document.getElementsByClassName('evolution-wrapper')[i].childNodes[5].innerHTML = "";
    }
    if(!Data.PokemonName === "Jangmo-o" || !Data.PokemonName === "Hakamo-o" || !Data.PokemonName === "Kommo-o"){
        EvolutionLine(Data.PokemonName.replace("-"," "));
    }else{
        EvolutionLine(Data.PokemonName);
    }
    ShowHideWrapper({"pokemonImage": "show", "circleWrapper": "show"});
    document.getElementById("loading").className = "none";
};

window.addEventListener('load', function() {
    SpatialNavigation.init();
    SpatialNavigation.add({
        selector: 'li, .navigate'
    });
    SpatialNavigation.makeFocusable();
});
ImageFileArray = ipcRenderer.sendSync('LoadImages');
VariantsImageArray = ipcRenderer.sendSync('LoadImagesVariants');
const RegionalDexData = JSON.parse(ipcRenderer.sendSync('LoadRegionalDex'));
RegionData = {
    "Kanto": "",
    "Johto": "",
    "Hoenn": "",
    "Sinnoh": "",
    "Unova": "",
    "Kalos": ["Central Kalos","Costal Kalos","Mountain Kalos"],
    "Alola": ["Melemele","Akala","Ula'ula","Poni"],
    "Galar": ["Galar","Isle of Armor","Crown Tundra","Other"]
};
if(configsData.Dextype === "regional"){
    for (const [OverAllRegion, RegionPart] of Object.entries(RegionData)) {
        document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h2'),{innerHTML: OverAllRegion, className: 'GenerationHeaders'}));
        document.getElementById("mainWrapperShiny").appendChild(Object.assign(document.createElement('h2'),{innerHTML: OverAllRegion, className: 'GenerationHeaders'}));
        if(RegionPart != ""){
            RegionPart.forEach(Element => {
                document.getElementById("mainWrapper").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Element, className: 'GenerationHeaders3'}));
                document.getElementById("mainWrapperShiny").appendChild(Object.assign(document.createElement('h3'),{innerHTML: Element, className: 'GenerationHeaders3'}));
                for (const [PokemonName, DexID] of Object.entries(RegionalDexData[Element])) {
                    if(OverAllRegion.includes("Galar") || OverAllRegion.includes("Alola")){
                        Name = OverAllRegion.replace("Galar", "Galarian ").replace("Alola", "Alolan ") + PokemonName;
                    }else{
                        Name = PokemonName;
                    }
                    let Data = GetPokemonDataFromName(Name);
                    if(VariantsImageArray.includes(Data.FileName) || Data != "error"){
                        createListEntry(Data.Link, Data.FileName, document.getElementById('mainWrapper'), Data.PokemonName, "regional", false);
                        createListEntry(Data.ShinyLink, Data.ShinyFileName, document.getElementById('mainWrapperShiny'), Data.PokemonName, "regional", "flex", true);
                    }else{
                        let Data = GetPokemonDataFromName(PokemonName);
                        createListEntry(Data.Link, Data.FileName, document.getElementById('mainWrapper'), Data.PokemonName, "regional", false);
                        createListEntry(Data.ShinyLink, Data.ShinyFileName, document.getElementById('mainWrapperShiny'), Data.PokemonName, true, "regional", "flex", true);
                    }  
                }; 
            }); 
        }else{
            for (const [PokemonName, value] of Object.entries(RegionalDexData[OverAllRegion])) {
                let Data = GetPokemonDataFromName(PokemonName);
                createListEntry(Data.Link, Data.FileName, document.getElementById('mainWrapper'), Data.PokemonName, "regional", false);
                createListEntry(Data.ShinyLink, Data.ShinyFileName, document.getElementById('mainWrapperShiny'), Data.PokemonName, true, "regional", true);        
            };
        }
    }; 
}else if(configsData.Dextype === "national"){
    ImageFileArray.forEach(element => {
        for (let [PokemonName, DexID] of Object.entries(PokemonData)) {
            if(element.replace(/\D/g,'').substring(1) === DexID){
                FileName = DexID + ".png";
                let Data = GetPokemonDataFromName(PokemonName);
                createListEntry(Data.Link, Data.FileName, document.getElementById('mainWrapper'), Data.PokemonName, "national", false);
                createListEntry(Data.ShinyLink, Data.ShinyFileName, document.getElementById('mainWrapperShiny'), Data.PokemonName, "national", true);
                VariantsImageArray.forEach(VariantsElement => {
                    if(VariantsElement.includes(DexID) && VariantsElement.includes("-Alolan")){
                        Data = GetPokemonDataFromName("Alolan " + PokemonName);
                        createListEntry(Data.Link, Data.FileName, document.getElementById('mainWrapper'), Data.PokemonName, "national", false);
                        createListEntry(Data.ShinyLink, Data.ShinyFileName, document.getElementById('mainWrapperShiny'), Data.PokemonName, "national", true);                       
                    }
                    if(VariantsElement.includes(DexID) && VariantsElement.includes("-Galarian")){
                        Data = GetPokemonDataFromName("Galarian " + PokemonName);
                        createListEntry(Data.Link, Data.FileName, document.getElementById('mainWrapper'), Data.PokemonName, "national", false);
                        createListEntry(Data.ShinyLink, Data.ShinyFileName, document.getElementById('mainWrapperShiny'), Data.PokemonName, "national", true);                       
                    }
                });
            }
        };
    });
}

function shakeAnimation(element, timeInSec) {
    element.style.animation = "shake " + timeInSec + "s";
    setTimeout(() => {
        element.style = ""; 
    }, timeInSec*1000);
};

document.getElementById('shinyBTN').addEventListener('click', () => {
    if(document.getElementById("mainWrapper").className === "pokedex-wrapper flex" || document.getElementById("mainWrapperShiny").className === "pokedex-wrapper flex"){
        if(document.getElementById("shinyBTN").className === "HideShiny"){   
            document.getElementById("shinyBTN").className = "ShowShiny";
            ScrollPoint = document.getElementById("mainWrapper").scrollTop;
            ShowHideWrapper({"mainWrapperShiny": "show"});
            document.getElementById("mainWrapperShiny").scrollTo(0,ScrollPoint);

        }else if(document.getElementById("shinyBTN").className === "ShowShiny"){
            document.getElementById("shinyBTN").className = "HideShiny";
            ScrollPoint = document.getElementById("mainWrapperShiny").scrollTop;
            ShowHideWrapper({"mainWrapper": "show"});
            document.getElementById("mainWrapper").scrollTo(0,ScrollPoint);
        }

    }else if(document.getElementById("pokemonImage").className === "flex"){
        if(document.getElementById("shinyBTN").className === "HideShiny"){   
            document.getElementById("shinyBTN").className = "ShowShiny";
            for (let Pokemon of document.getElementsByClassName("pokemon-evo")) {
                let PokemonName = Pokemon.getElementsByTagName("img")[0].dataset.pokemonname;
                let Data = GetPokemonDataFromName(PokemonName);
                let HTMLElements = ["img","p"];
                Pokemon.getElementsByTagName("img")[0].src = Data.ShinyLink;
                HTMLElements.forEach(Element => {
                    Pokemon.getElementsByTagName(Element)[0].dataset.pokemonimg = Data.ShinyFileName;
                    Pokemon.getElementsByTagName(Element)[0].dataset.shiny = "true";                    
                });
            };
            let PokemonName = document.getElementById("pokemonImage").dataset.pokemonname;
            let Data = GetPokemonDataFromName(PokemonName);
            document.getElementById("pokemonImage").dataset.shiny = "true";
            document.getElementById("pokemonImage").style.backgroundImage = "url(" + Data.ShinyLink + ")";

        }else if(document.getElementById("shinyBTN").className === "ShowShiny"){
            for (let Pokemon of document.getElementsByClassName("pokemon-evo")) {
                let PokemonName = Pokemon.getElementsByTagName("img")[0].dataset.pokemonname;
                let Data = GetPokemonDataFromName(PokemonName);
                let HTMLElements = ["img","p"];
                Pokemon.getElementsByTagName("img")[0].src = Data.Link;
                HTMLElements.forEach(Element => {
                    Pokemon.getElementsByTagName(Element)[0].dataset.pokemonimg = Data.FileName;
                    Pokemon.getElementsByTagName(Element)[0].dataset.shiny = "false";                    
                });
            };
            let PokemonName = document.getElementById("pokemonImage").dataset.pokemonname;
            let Data = GetPokemonDataFromName(PokemonName);
            document.getElementById("pokemonImage").dataset.shiny = "false";
            document.getElementById("pokemonImage").style.backgroundImage = "url(" + Data.Link + ")";
            document.getElementById("shinyBTN").className = "HideShiny";
        }
    }else if(document.getElementById("searchWrapper").className === "search-wrapper flex" || document.getElementById("searchWrapper").className === "search-wrapper"){
        if(document.getElementById("shinyBTN").className === "HideShiny"){   
            document.getElementById("shinyBTN").className = "ShowShiny";
        }else if(document.getElementById("shinyBTN").className === "ShowShiny"){
            document.getElementById("shinyBTN").className = "HideShiny";
        }
    }
    emptySearch();
});

/*          Menu            */
document.getElementById('settingsBTN').addEventListener('click', () => {
    document.getElementById(configsData.Dextype).setAttribute('selected', 'selected');
    emptySearch();
    ShowHideWrapper({"settingsWrapper": "show"});
});
document.getElementById('searchBTN').addEventListener('click', () => {
    if(document.getElementById("NorR").value != configsData.Dextype){
        shakeAnimation(document.getElementById("saveSettings"), 0.5);
    }else{
        emptySearch();
        ShowHideWrapper({"searchWrapper": "show"});
    }
});
document.getElementById('pokedexBTN').addEventListener('click', () => {
    if(document.getElementById("NorR").value != configsData.Dextype){
        shakeAnimation(document.getElementById("saveSettings"), 0.5);
    }else{
        emptySearch();
        if(document.getElementById("shinyBTN").className === "ShowShiny"){
            ShowHideWrapper({"mainWrapperShiny": "show"});
        }else if(document.getElementById("shinyBTN").className === "HideShiny"){
            ShowHideWrapper({"mainWrapper": "show"});
        }
    }
});
document.getElementById('backBTN').addEventListener('click', () => {
    if(document.getElementById("NorR").value != configsData.Dextype){
        shakeAnimation(document.getElementById("saveSettings"), 0.5);
    }else{
        emptySearch();
        ShowHideWrapper({"searchWrapper": "show"});
    }
});
/*          Menu            */

/*          Settings            */
document.getElementById("saveSettings").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("ConfirmBTN").className = "flex";
    document.getElementById("ConfirmBTNText").innerHTML = "Pokedex needs to restart to apply changes";
});
document.getElementById("OkayBTN").addEventListener('click', () => {
    let jsonData = '{"Dextype": "' + document.getElementById("NorR").value + '"}';
    ipcRenderer.send('SaveConfig', jsonData);
    ipcRenderer.on('SaveConfigReply', (event, reply) => {
        if(reply === true){
            ipcRenderer.send('RestartApp');
        }
    });
});
document.getElementById("CancelBTN").addEventListener('click', () => {
    document.getElementById("ConfirmBTN").className = "none";
});
/*          Settings            */

/*          Search            */
document.getElementById('searchResults').addEventListener('click', (e) => {
    if(e.target !== document.getElementById('searchResults')){
        if(e.target.tagName !== 'LI'){
            FileName = e.target.parentNode.childNodes[1].alt;
            PokemonName = e.target.parentNode.childNodes[3].innerHTML;
        }else{
            FileName = e.target.childNodes[1].alt;
            PokemonName = e.target.childNodes[3].innerHTML;
        }
        PreparePokemonPage(FileName, PokemonName);
    }
});
document.getElementById('searchResults').addEventListener('keypress', (e) => {
    if (e.code === "Enter" ) {
        if(e.target !== document.getElementById('searchResults')){
            if(e.target.tagName === 'LI' || e.target.tagName === 'IMG' || e.target.tagName === 'DIV'){
                PreparePokemonPage(e.target.childNodes[1].alt, e.target.childNodes[3].innerHTML);
            }
        }
    }
});
/*          Search            */

/*          Pokedex            */
NormalAndShinyWrapper = ["mainWrapper", "mainWrapperShiny"];
NormalAndShinyWrapper.forEach(element => {
    document.getElementById(element).addEventListener('click', (e) => {
        if(e.target.tagName === "LI"){
            var FileName = e.target.childNodes[0].alt;
            var PokemonName = e.target.childNodes[1].innerHTML;
        }
        else if(e.target.tagName === "IMG" || e.target.tagName === "P"){
            var FileName = e.target.parentNode.childNodes[0].alt;
            var PokemonName = e.target.parentNode.childNodes[1].innerHTML;
        }
        PreparePokemonPage(FileName, PokemonName);
    });
    document.getElementById(element).addEventListener('keypress', (e) => {
        if (e.code === "Enter" ) {
            if(e.target.tagName === "LI"){
                var FileName = e.target.childNodes[0].alt;
                var PokemonName = e.target.childNodes[1].innerHTML;
                PreparePokemonPage(FileName, PokemonName);
            }
        }
    });
});
/*          Pokedex            */

/*          Evolution line on the Pokemon Page            */
document.getElementById("evolution-wrapper").addEventListener('click', (e) => {
    if(e.target.tagName === "P" || e.target.tagName === "IMG" ){
        if(e.target.className != "EvoSteps"){
            document.getElementById("pokemonImage").scrollTo(0,0);
            if(e.target.dataset.shiny === "true"){
                PreparePokemonPage(e.target.dataset.pokemonimg, e.target.dataset.pokemonname, true);
            }else{
                PreparePokemonPage(e.target.dataset.pokemonimg, e.target.dataset.pokemonname);
            }
        }
    }
});
/*          Evolution line on the Pokemon Page            */