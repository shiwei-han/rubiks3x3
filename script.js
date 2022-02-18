import Rubik from './rubiks3x3/Rubiks3x3.js';

const rubik = new Rubik();
rubik.getHtmlElements().forEach(e => {
    document.body.appendChild(e);
});
