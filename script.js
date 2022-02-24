import Controller from './rubiks3x3MVC/Controller.js';
import Model from './rubiks3x3MVC/Model.js';
import View from './rubiks3x3MVC/View.js';

const controller = new Controller(new Model(),new View());

document.body.appendChild(controller.getViewDOM());
