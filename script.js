import Rubik from 'rubiks3x3/Rubiks3x3.js';

const rubik = new Rubik();
rubik.getHtmlElements().forEach(tile =>{
    document.getElementById("main").append(tile);
});
