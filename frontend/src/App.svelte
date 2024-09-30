<script>
  import Search from './Search.svelte';

  import {
    Greet
  } from '../wailsjs/go/main/App.js'

  let resultText = "Please enter your name below 👇"
  let name

  function greet() {
    Greet(name).then(result => resultText = result)
  }
</script>
  <!-- Rotom Eyes -->
  <div class="eye-wrapper" style="--wails-draggable:drag; widows: 1">
    <div class="eye">
    <div class="inner-eye"></div>
  </div>
  <div class="arch">
    <div class="arch-top"></div>
    <div class="arch-bottom"></div>
  </div>
  <div class="eye">
    <div class="inner-eye"></div>
  </div>
</div>
<!-- Rotom Eyes -->
<!-- Wrapper -->
<div class="global-wrapper">
  <!-- Toolbar -->
  <div class="toolbar" style="--wails-draggable:drag; widows: 1">
    <ul>
      <li id="minimizeBTN"></li>
      <li id="maximizeBTN"></li>
      <li id="closeBTN"></li>
    </ul>
  </div>
  <!-- Toolbar -->


  <Search />

</div>

<!-- {#await newUser} 
  {:then result}
    {#if result }
      <Setup />
    {:else}
      <Main />
    {/if}
  {/await} -->
<style>
</style>