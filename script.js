import Controller from './rubiks3x3MVC/Controller.js';
import Model from './rubiks3x3MVC/Model.js';
import View from './rubiks3x3MVC/View.js';

const controller = new Controller(new Model(3),new View(3));

document.body.appendChild(controller.getViewDOM());
