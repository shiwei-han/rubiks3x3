export default class Rubik3x3 {

    constructor() {
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            "<link rel=\"stylesheet\" href=\"./rubiks3x3/rubiks3x3.css\" />");

        this.APP_CSS = "app";
        this.TILE_SIZE_CSS = "tileSize";
        this.TILE_COLOR_CSS = {
            RED: "redTile",
            BLUE: "blueTile",
            YELLOW: "yellowTile",
            GREEN: "greenTile",
            CLEAR: "clearTile"
        }
        this.MESSAGE_CSS = "message";
        this.tiles = this.generateTiles();
        this.message = this.generateMessage();
    }

    getHtmlElements() {
        const app = document.createElement("div");
        app.classList.add(this.APP_CSS);
        this.tiles.concat(this.message).forEach(e => {
            app.appendChild(e);
        });
        
        return [app];
    }

    generateTiles() {
        const tileColors = this.shuffle([
            this.TILE_COLOR_CSS.RED, 
            this.TILE_COLOR_CSS.RED,
            this.TILE_COLOR_CSS.BLUE,
            this.TILE_COLOR_CSS.BLUE,
            this.TILE_COLOR_CSS.YELLOW,
            this.TILE_COLOR_CSS.YELLOW,
            this.TILE_COLOR_CSS.GREEN,
            this.TILE_COLOR_CSS.GREEN,
            this.TILE_COLOR_CSS.CLEAR]);

        return tileColors.map(tileColor => {
            const element = document.createElement("div");
            element.classList.add(this.TILE_SIZE_CSS);
            element.classList.add(tileColor);
            element.addEventListener("click", this.tileClick.bind(this));
            return element;
        }); 
    }

    tileClick(event) {
        const clearTile = this.tiles.filter(tile => tile.classList.contains(this.TILE_COLOR_CSS.CLEAR))[0];
        const clickedTile = event.target;

        if(this.isAdjacent(clearTile, clickedTile)){
            this.swapTileColor(clearTile, clickedTile);
            this.checkWin(this.tiles);
        }
    }

    checkWin(tiles){
        const tileColorMap = new Map(Object.entries(this.TILE_COLOR_CSS));
        const iterator = tileColorMap.values();

        let result = iterator.next();
        while (!result.done) {

            const tilesSharingColor = tiles.filter(tile => tile.classList.contains(result.value));
            if(tilesSharingColor.length == 2){
                if(!this.isAdjacent(tilesSharingColor[0], tilesSharingColor[1])){
                    return;
                }
            }
            
            result = iterator.next();
        }
        
        this.showMessage();
        this.disableAllclickEvents(tiles);
    }

    generateMessage() {
        const element = document.createElement("div");
        element.classList.add(this.MESSAGE_CSS);
        return element;
    }

    showMessage() {
        this.message.innerHTML = "Well done!";
    }

    disableAllclickEvents(tiles) {
        tiles.forEach(tile => tile.replaceWith(tile.cloneNode(true)));
    }

    isAdjacent(tile1, tile2) {
        const tile1Idx = this.tiles.indexOf(tile1);
        const tile2Idx = this.tiles.indexOf(tile2);
        return Math.abs(tile1Idx - tile2Idx) == 3 ||
                (Math.abs(tile1Idx - tile2Idx) == 1 && Math.min(tile1Idx, tile2Idx)%3 != 2)
    }

    swapTileColor(tile1, tile2) {
        const temp = tile1.className;
        tile1.className = tile2.className;
        tile2.className = temp; 
    }

    shuffle(array) {
        let counter = array.length;

        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }

}