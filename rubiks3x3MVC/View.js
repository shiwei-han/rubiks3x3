import Index2D from './Index2D.js';

export default class View {
    constructor() {
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            "<link rel=\"stylesheet\" href=\"./rubiks3x3MVC/style/rubiks3x3.css\" />");
        this.APP_CSS = "app";
        this.TILE_SIZE_CSS = "tileSize";
        this.TILE_COLOR_CSS = {
            CLEAR: "clearTile",
            RED: "redTile",
            BLUE: "blueTile",
            YELLOW: "yellowTile",
            GREEN: "greenTile",
            ORANGE: "orangeTile",
            PLUM: "plumTile"
        }
        this.MESSAGE_CSS = "message";
        this.LEVEL_CSS = "level";
    }

    addController(controller) {
        this.controller = controller;
    }

    initialize(){
        this.viewDOM = this.createApp();
        this.addAppContent();
    }

    getDOM(){
        return this.viewDOM;
    }

    getTilesDOMs(){
        return Array.from(this.viewDOM.childNodes).filter(e => e.classList.contains(this.TILE_SIZE_CSS));
    }

    getMessageDOM(){
        return this.viewDOM.lastChild;
    }

    _render(idx2Ds){
        idx2Ds.forEach(index2D => {
            this.updateTileView(index2D);
        });
        if(this.controller.hasWon()){
            this.showMessage();
        }
    }

    showMessage() {
        this.getMessageDOM().innerHTML = "Well done!";
    }

    updateTileView(idx2D){
        const e = this.getTilesDOMs()[idx2D.x*this.controller.getRowSize() + idx2D.y];
        e.className = '';
        e.classList.add(this.TILE_SIZE_CSS);
        e.classList.add(this.translateModelToClassName(this.controller.getModelByIndex2D(idx2D)));
    }

    createApp() {
        const app = document.createElement("div");
        app.classList.add(this.APP_CSS);
        app.classList.add(this.addAppGridCSS());
        return app;
    }

    addAppContent(){
        this.generateTiles()
        .concat(this.generateMessage())
        .concat(this.generateLevelSelector()).
        forEach(e => {
            this.getDOM().append(e);
        });
    }

    clear(){
        const head = document.getElementsByTagName('head')[0];
        Array.from(head.getElementsByTagName('style')).forEach(e => head.removeChild(e));
        Array.from(this.getDOM().childNodes).forEach(e => this.getDOM().removeChild(e));
    }

    addAppGridCSS(){
        let grid = document.createElement('style');
        grid.innerHTML = '.appGrid { grid-template-columns: repeat('+this.controller.getRowSize()+', 1fr); }';
        document.getElementsByTagName('head')[0].appendChild(grid);
        return 'appGrid';
    }

    onTileClicked(event){
        this.controller.onTileClicked(Array.from(this.viewDOM.childNodes).indexOf(event.target), this._render.bind(this));
    }

    onLevelClicked(event){
        this.clear();
        this.controller.onLevelClicked(event.target.value, this.addAppContent.bind(this));
    }

    generateTiles() {
        const model = this.controller.getGridModel();
        return model.flat().map( (model, idx) => {
            const element = document.createElement("div");
            element.classList.add(this.TILE_SIZE_CSS);
            element.classList.add(this.translateModelToClassName(model));
            element.onclick = this.onTileClicked.bind(this);
            return element;
        }); 
    }

    generateLevelSelector() {
        const div = document.createElement("div");
        for(let i=3; i<6; i++){
            const label = document.createElement("label");
            label.innerText = "  ";
            div.append(label);
            
            const rBtn = document.createElement("input");
            rBtn.name ='level'
            rBtn.type = 'radio';
            rBtn.value = i;
            rBtn.onclick = this.onLevelClicked.bind(this);
            div.append(rBtn);

            
        }
        div.classList.add(this.LEVEL_CSS);
        div.classList.add(this.addWholeRowGridCSS());
        return div;
    }

    generateMessage() {
        const element = document.createElement("div");
        element.classList.add(this.MESSAGE_CSS);
        element.classList.add(this.addWholeRowGridCSS());
        return element;
    }

    addWholeRowGridCSS(){
        let grid = document.createElement('style');
        grid.innerHTML = '.msgGrid{grid-column: 1/ span '+this.controller.getRowSize()+'; }'; 
        document.getElementsByTagName('head')[0].appendChild(grid);
        return 'msgGrid';
    }

    translateModelToClassName(model){
        switch(model) {
            default:
            case 0: return this.TILE_COLOR_CSS.CLEAR;
            case 1: return this.TILE_COLOR_CSS.RED;
            case 2: return this.TILE_COLOR_CSS.BLUE;
            case 3: return this.TILE_COLOR_CSS.YELLOW;
            case 4: return this.TILE_COLOR_CSS.GREEN;
            case 5: return this.TILE_COLOR_CSS.ORANGE;
            case 6: return this.TILE_COLOR_CSS.PLUM;
        }    
    }
}