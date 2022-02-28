import Index2D from './Index2D.js';

export default class View {
    constructor(rowSize) {
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            "<link rel=\"stylesheet\" href=\"./rubiks3x3MVC/style/rubiks3x3.css\" />");
        this.APP_CSS = "app";
        this.TILE_SIZE_CSS = this.addTileSizeCSS(rowSize);
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
        this.HIDE = "hide";

        this.CHOSEN_BUTTON_COLOR = "chosenButtonColor";
        this.BUTTON_COLOR = "buttonColor";
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

    _render(idx2Ds){
        idx2Ds.forEach(index2D => {
            this.updateTileView(index2D);
        });
        if(this.controller.hasWon()){
            this.showMessage();
        }
    }

    showMessage() {
        this.messageDOM.classList.remove(this.HIDE);
        this.tilesDOM.forEach(e => e.onclick = undefined);
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
        Array.from(this.getDOM().childNodes).forEach(e => this.getDOM().removeChild(e));
        Array.from(head.getElementsByTagName('style')).forEach(e => head.removeChild(e));
    }

    addAppGridCSS(){
        let grid = document.createElement('style');
        grid.innerHTML = '.appGrid { grid-template-columns: repeat('+this.controller.getRowSize()+', 1fr); }';
        document.getElementsByTagName('head')[0].appendChild(grid);
        return 'appGrid';
    }

    addTileSizeCSS(rowSize){
        const tileSize = document.createElement('style');
        const size = (80 - rowSize)/rowSize;
        tileSize.innerHTML = '.tileSize { width: ' + size +'vmin;height: '+size+'vmin;}';
        document.getElementsByTagName('head')[0].appendChild(tileSize);
        return 'tileSize';
    }

    onTileClicked(event){
        this.controller.onTileClicked(Array.from(this.viewDOM.childNodes).indexOf(event.target), this._render.bind(this));
    }

    onLevelClicked(event){
        this.clear();
        this.addTileSizeCSS(parseInt(event.target.value));
        this.controller.onLevelClicked(event.target.value, this.addAppContent.bind(this));
    }

    generateTiles() {
        const model = this.controller.getGridModel();
        this.tilesDOM = model.flat().map( (model, idx) => {
            const element = document.createElement("div");
            element.classList.add(this.TILE_SIZE_CSS);
            element.classList.add(this.translateModelToClassName(model));
            element.onclick = this.onTileClicked.bind(this);
            return element;
        }); 
        return this.tilesDOM;
    }

    generateLevelSelector() {
        const div = document.createElement("div");
        for(let i=3; i<6; i++){
            const link = document.createElement("button");
            link.innerHTML = i;
            link.value = i;
            link.href = "";
            if(i == this.controller.getRowSize()){
                link.classList.add(this.CHOSEN_BUTTON_COLOR);
            }else{
                link.classList.add(this.BUTTON_COLOR);
            }
            
            link.onclick = this.onLevelClicked.bind(this);
            div.append(link);        
        }
        div.classList.add(this.LEVEL_CSS);
        div.classList.add(this.addWholeRowGridCSS());
        return div;
    }

    generateMessage() {
        const element = document.createElement("div");
        element.innerHTML = "Well done!";
        element.classList.add(this.MESSAGE_CSS);
        element.classList.add(this.HIDE);
        element.classList.add(this.addWholeRowGridCSS());

        this.messageDOM = element;
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