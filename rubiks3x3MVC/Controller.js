import Index2D from './Index2D.js';
import Model from './Model.js';
import View from './View.js';

export default class Controller {
    constructor(size) {
        this.model = new Model(size);
        this.view = new View(size);
        this.view.addController(this);
        this.view.initialize();
    }

    getViewDOM(){
        return this.view.getDOM();
    }

    getGridModel(){
        return this.model.getGridModel();
    }

    getModelByIndex2D(idx2D){
        return this.model.get(idx2D);
    }

    getRowSize(){
        return this.model.getRowSize();
    }

    onTileClicked(idx, _render){
        this.model.updateOnTileClicked(this.indexConvertTo2D(idx), _render);
    }

    indexConvertTo2D(idx){
        const y = idx % this.getRowSize();
        const x = (idx-y)/this.getRowSize();
        return new Index2D(x,y);
    }

    hasWon(){
        return this.model.hasWon();
    }
    onLevelClicked(level, _render){
        this.model.updateOnLevelClicked(level, _render);
    }
}