<script>
  import {
    Greet
  }

  from '../wailsjs/go/main/App.js'

  let resultText = "Please enter your name below 👇"

  let name
  function greet() {
    Greet(name).then(result => resultText = result)
  }
</script>
<div class="global-wrapper">
  <div class="toolbar" style="--wails-draggable:drag; widows: 1">
    <ul>
      <li id="minimizeBTN"></li>
      <li id="maximizeBTN"></li>
      <li id="closeBTN"></li>
    </ul>
  </div>
  <div class="menu">
    <ul>
      <li id="shinyBTN" class="HideShiny"></li>
      <li id="settingsBTN"></li>
      <li id="searchBTN"></li>
      <li id="pokedexBTN"></li>
    </ul>
  </div>
  <div class="settings-wrapper" id="settingsWrapper">
    <form>
      <div class="dextype"><label for="NorR">Dextype:</label><select name="NorR" id="NorR">
          <option value="national" id="national">National Dex</option>
          <option value="regional" selected="selected" id="regional">Regional Dex</option>
        </select></div><input type="submit" value="Save" id="saveSettings">
    </form>
    <div id="ConfirmBTN" class="none">
      <h2 id="ConfirmBTNText"></h2>
      <div class="ConfirmBTNWrapper">
        <p id="OkayBTN">Okay</p>
        <p id="CancelBTN">Cancel</p>
      </div>
    </div>
  </div>
  <div class="pokedex-wrapper" id="mainWrapper"></div>
  <div class="pokedex-wrapper" id="mainWrapperShiny"></div>
  <div class="PokemonImageWrapper">
    <div id="loading" class="none"><img src="assets/static/pokeball.svg" alt="Pokeball loading animation"></div>
    <div class="none" id="pokemonImage">
      <div id="backBTN"></div>
      <div class="information-wrapper">
        <div class="information">
          <div class="flex">
            <h3 id="DexID"></h3>
          </div>
          <div class="flex">
            <h2 id="Name"></h2>
          </div>
          <div class="flex">
            <h4 id="Species"></h4>
          </div>
          <div id="type-wrapper"></div>
          <div class="flex">
            <p id="Abilities"></p>
          </div>
          <div id="size-wrapper">
            <div id="Height">
              <h4></h4>
            </div>
            <div id="Weight">
              <h4></h4>
            </div>
          </div>
          <div class="stats-wrapper">
            <div class="progress-wrapper">
              <div class="base-stats">
                <p><b>HP:</b></p>
                <p id="HP-stat"></p>
              </div>
              <div class="progress-bar">
                <div class="progress" id="HP-stat-bar"></div>
              </div>
              <div class="min-max-stats">
                <p id="HP-min-stat"></p>
                <p id="HP-max-stat"></p>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="base-stats">
                <p><b>Attack:</b></p>
                <p id="Attack-stat"></p>
              </div>
              <div class="progress-bar">
                <div class="progress" id="Attack-stat-bar"></div>
              </div>
              <div class="min-max-stats">
                <p id="Attack-min-stat"></p>
                <p id="Attack-max-stat"></p>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="base-stats">
                <p><b>Defense:</b></p>
                <p id="Defense-stat"></p>
              </div>
              <div class="progress-bar">
                <div class="progress" id="Defense-stat-bar"></div>
              </div>
              <div class="min-max-stats">
                <p id="Defense-min-stat"></p>
                <p id="Defense-max-stat"></p>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="base-stats">
                <p><b>Sp. Atk:</b></p>
                <p id="Special-Attack-stat"></p>
              </div>
              <div class="progress-bar">
                <div class="progress" id="Special-Attack-stat-bar"></div>
              </div>
              <div class="min-max-stats">
                <p id="Special-Attack-min-stat"></p>
                <p id="Special-Attack-max-stat"></p>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="base-stats">
                <p><b>Sp. Def:</b></p>
                <p id="Special-Defense-stat"></p>
              </div>
              <div class="progress-bar">
                <div class="progress" id="Special-Defense-stat-bar"></div>
              </div>
              <div class="min-max-stats">
                <p id="Special-Defense-min-stat"></p>
                <p id="Special-Defense-max-stat"></p>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="base-stats">
                <p><b>Speed:</b></p>
                <p id="Speed-stat"></p>
              </div>
              <div class="progress-bar">
                <div class="progress" id="Speed-stat-bar"></div>
              </div>
              <div class="min-max-stats">
                <p id="Speed-min-stat"></p>
                <p id="Speed-max-stat"></p>
              </div>
            </div>
            <div class="total-stats">
              <div class="base-stats">
                <p><b>Total:</b></p>
                <p id="Total-stat"></p>
              </div>
              <div class="min-max-text">
                <p><b>Min</b></p>
                <p><b>Max</b></p>
              </div>
            </div>
          </div>
          <div style="display: flex; width: 80px;">
            <h2 class="section-title"><b>Training</b></h2>
          </div>
          <div id="training-wrapper"></div>
          <div style="display: flex; width: 80px;">
            <h2 class="section-title"><b>Evolution</b></h2>
          </div>
          <div id="evolution-wrapper">
            <div class="evolution-wrapper">
              <div id="Stage0"></div>
              <div id="Stage1"></div>
              <div id="Stage2"></div>
            </div>
            <div class="evolution-wrapper">
              <div id="Stage00"></div>
              <div id="Stage11"></div>
              <div id="Stage22"></div>
            </div>
            <div class="evolution-wrapper">
              <div id="Stage000"></div>
              <div id="Stage111"></div>
              <div id="Stage222"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="circleWrapper"><svg version="1.1" id="circle" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 500 500"
        style="enable-background:new 0 0 500 500;" xml:space="preserve">
        <path id="st0" d="M500,131.99V0C223.86,0,0,223.86,0,500h131.99C131.99,296.75,296.75,131.99,500,131.99z" /></svg>
    </div>
  </div>
</div>
<style>
  /*   Pokedex   */
  .settings-wrapper {
    width: 100%;
    height: calc(100vh - 220px);
    overflow-x: auto;
    background-color: #F2F5F8;
    z-index: 5;
    display: none;
    flex-wrap: wrap;
  }

  .dextype {
    display: flex;
    justify-content: space-between;
    width: 200px;
  }

  .settings-wrapper form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .settings-wrapper form input {
    width: 200px;
    background-color: #DE6463;
    border: none;
    padding: 5px;
    border-radius: 5px;
    margin-top: 20px;
  }

  #ConfirmBTN {
    width: 35%;
    height: 35%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 1px solid #dfe6e9;
    background-color: #ffffff;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }

  #ConfirmBTN h2 {
    padding: 25px;
  }

  #ConfirmBTN p {
    width: 30%;
    text-align: center;
    padding: 5px;
    border-radius: 10px;
    margin: 0px 5px 0px 5px;
  }

  #ConfirmBTN p:first-of-type {
    background-color: #ffffff;
    border: 1px solid #2ECC70;
  }

  #ConfirmBTN p:first-of-type:hover {
    transition: background-color 0.5s;
    background-color: #2ECC70;
    cursor: pointer;
  }

  #ConfirmBTN p:last-of-type {
    background-color: #ffffff;
    border: 1px solid #e74c3c;
  }

  #ConfirmBTN p:last-of-type:hover {
    transition: background-color 0.5s;
    background-color: #e74c3c;
    cursor: pointer;
  }

  .ConfirmBTNWrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .pokedex-wrapper {
    width: 100%;
    height: calc(100vh - 220px);
    overflow-x: auto;
    background-color: #F2F5F8;
    z-index: 5;
    display: none;
    flex-wrap: wrap;
  }

  /* width */
  .pokedex-wrapper::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  .pokedex-wrapper::-webkit-scrollbar-track {
    background: #DE6463;
  }

  /* Handle */
  .pokedex-wrapper::-webkit-scrollbar-thumb {
    background: #CD5352;
  }

  /* Handle on hover */
  .pokedex-wrapper::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /*   Pokedex   */
  /*   Pokemon   */
  .GenerationHeaders {
    width: 100%;
    padding: 30px 0px;
    margin: 0px 30px;
    font-size: 32px;
    border-bottom: 1px solid #bdc3c7;
  }

  .GenerationHeaders3 {
    width: 100%;
    padding: 30px 0px;
    margin: 0px 50px;
    font-size: 22px;
    border-bottom: 1px solid #E6E9EC;
  }

  .pokemon {
    width: 230px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    box-sizing: border-box;
  }

  .pokemon:hover {
    background-color: #E6E9EC;
    cursor: pointer;
  }

  .pokemon:focus {
    background-color: #E6E9EC;
    cursor: pointer;
  }

  .pokemon img {
    width: 100px;
  }

  .PokemonImageWrapper {
    background-color: #F2F5F8;
    position: relative;
    z-index: 2;
  }

  #pokemonImage {
    width: 100%;
    height: calc(100vh - 220px);
    position: relative;
    z-index: 1;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: 20vw;
    background-position-x: calc(95%);
    background-position-y: calc(95%);
    overflow-y: auto;
  }

  #pokemonImage::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  #pokemonImage::-webkit-scrollbar-track {
    background: #DE6463;
  }

  /* Handle */
  #pokemonImage::-webkit-scrollbar-thumb {
    background: #CD5352;
  }

  /* Handle on hover */
  #pokemonImage::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  #backBTN {
    width: 30px;
    height: 30px;
    border: 1px solid black;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px;
    background-image: url('../static/back-arrow.svg');
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 200;
  }

  #backBTN:hover {
    filter: invert(100%);
    cursor: pointer;
  }

  .information-wrapper {
    width: 50%;
    height: calc(100vh - 220px);
  }

  .information {
    margin-top: 55px;
  }

  #Name {
    font-size: 60px;
  }

  #Species {
    margin-top: 5px;
  }

  #DexID {
    font-size: 30px;
  }

  #type-wrapper {
    display: flex;
    width: 100%;
    margin: 20px 20px 20px 0px;
  }

  .type {
    display: flex;
    height: 25px;
    background-color: #262626;
    border-radius: 7px;
  }

  .type-name {
    align-items: center;
    justify-content: center;
    display: flex;
    color: #ffffff;
    font-size: 17px;
    padding: 0px 10px;
  }

  .type:first-of-type {
    margin-right: 35px;
  }

  .type-icon {
    width: 50px;
    height: 100%;
    border-radius: 7px 0px 0px 7px;
    clip-path: polygon(0 0, 100% 0%, 52% 100%, 0% 100%);
  }

  .type-icon>img {
    height: 100%;
    margin-left: 5px;
  }

  .AbilitiesH2 {
    font-size: 25px;
    margin: 20px 0px 10px 0px;
  }

  #Abilities {
    display: inline-flex;
    margin-bottom: 15px;
  }

  #Abilities>span {
    display: flex;
    margin: 0px 0px 5px 5px;
  }

  #size-wrapper {
    display: inline-flex;
    flex-direction: column;
    margin-bottom: 15px;
  }

  #size-wrapper>div {
    display: flex;
    margin: 0px 0px 5px 0px;
  }

  #size-wrapper>div>p:first-of-type {
    margin-right: 15px;
  }

  .stats-wrapper {
    font-size: 15px;
    width: 100%;
  }

  .base-stats {
    display: inline-flex;
  }

  .base-stats>p:first-of-type {
    width: 80px;
  }

  .base-stats>p:last-of-type {
    width: 35px;
    margin-top: -2;
  }

  .min-max-stats {
    display: flex;
  }

  .min-max-stats>p {
    margin-left: 25px;
  }

  .min-max-text {
    display: inline-flex;
  }

  .min-max-text>p:first-of-type {
    margin-right: 20px;
  }

  .total-stats {
    display: flex;
    justify-content: space-between;
  }

  .section-title {
    margin-top: 20px;
    font-size: 25px;
  }

  .progress-wrapper {
    display: flex;
    margin: 0px 0px 5px 0px;
  }

  .progress-bar {
    width: 350px;
    height: 18px;
    margin: 0px 0px 0px 20px;
  }

  .progress {
    height: 13px;
    border-radius: 20px;
  }

  .stats-red {
    background-color: #F88388;
  }

  .stats-yellow {
    background-color: #ffdd57;
  }

  .stats-green {
    background-color: #a0e515;
  }

  .evolution-wrapper {
    display: flex;
    align-items: center;
  }

  .Pokemon-evo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .EvoPokemon {
    padding: 10px;
  }

  .EvoPokemon>img {
    height: 100px;
  }

  .EvoPokemon>p {
    text-align: center;
  }

  .EvoPokemon:hover {
    cursor: pointer;
  }

  .EvoSteps {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    height: 116px;
    width: 100px;
    text-align: center;
    font-size: 12px;
  }

  #circleWrapper {
    display: none;
    position: fixed;
    bottom: calc(0% + 20px);
    right: calc(0% + 20px);
    z-index: 0;
  }

  #circle {
    width: 480px;
  }

  /*   Keyframes   */
  @keyframes fadein {
    from {
      opacity: 0.7;
    }

    to {
      opacity: 1;
    }
  }
</style>