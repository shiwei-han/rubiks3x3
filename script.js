import Controller from './rubiks3x3MVC/Controller.js';

const controller = new Controller(4);

document.body.appendChild(controller.getViewDOM());
