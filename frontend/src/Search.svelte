<script>

</script>

<div class="search-wrapper" id="searchWrapper">
  <div class="center-wrapper">
    <form>
      <label for="search">Search Pokemon</label>
      <input type="text" id="search" placeholder="Search:" class="navigate" autofocus>
      <ul class="search-results" id="searchResults">
          {#each {length: 5} as _, i}
            <li class="navigate none" id="result{1}">
              <img src="" id="imageresult{i}">
              <div id="Showresult{i}}"></div>
            </li>
          {/each}
      </ul>
    </form>
  </div>
</div>

<style>

/*   Search   */
#search{
	text-transform: capitalize;
}
.search-wrapper{
	width: 100%;
	height: calc(100vh - 220px);
	overflow-x: auto;
	background-color: #F2F5F8;
	z-index: 5;
	display: flex;
	flex-wrap: wrap;
}
.search-wrapper form{
	width: calc(100vw - 40px);
	position: absolute;
	top: 40%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.search-wrapper form label{
	font-size: 45px;
}
.search-wrapper form input{
	border: 0px;
	height: 35px;
	width: 80%;
	border-bottom: 1px solid grey;
	background-color: #F2F5F8;
}
.search-results{
	text-transform: capitalize;
	position: relative;
	display: flex;
	flex-direction: column;
	width: 80%;
}
.search-results img{
	height: 25px;
	padding: 0px 5px 0px 5px;
}
.search-results li{
	width: calc(100%);
	color: black;
	font-size: 15px;
	padding: 5px;
	box-sizing: border-box;
}
.search-results li{
	text-decoration: none;
	display: flex;
	flex-wrap: wrap;
}
.search-results li div{
	padding: 5px;
}
.search-results li:focus{
	background-color: lightgrey;
}
.search-results li:hover{
	background-color: lightgrey;
}
/*   Search   */
</style>