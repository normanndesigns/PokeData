const {remote} = require('electron'); 

var close = document.getElementById('closeBTN').addEventListener('click', closeWindow)
var minimize = document.getElementById('minimizeBTN').addEventListener('click', minimizeWindow)
var maximize = document.getElementById('maximizeBTN').addEventListener('click', maximizeWindow)


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
    window.maximize();
}
