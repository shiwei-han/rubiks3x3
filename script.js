const TILE_SIZE_CSS = "tileSize";

const TILE_COLOR_CSS = {
    RED: "redTile",
    BLUE: "blueTile",
    YELLOW: "yellowTile",
    GREEN: "greenTile",
    CLEAR: "clearTile"
}

const MESSAGE_CSS = "message";

let mainDiv;

const loadTiles = (mainDivId) => {
    mainDiv = document.getElementById(mainDivId);
    const tileColors = shuffle([TILE_COLOR_CSS.RED, 
                          TILE_COLOR_CSS.RED,
                          TILE_COLOR_CSS.BLUE,
                          TILE_COLOR_CSS.BLUE,
                          TILE_COLOR_CSS.YELLOW,
                          TILE_COLOR_CSS.YELLOW,
                          TILE_COLOR_CSS.GREEN,
                          TILE_COLOR_CSS.GREEN,
                          TILE_COLOR_CSS.CLEAR]);

    for(let i = 0; i < 9; i++){
        const element = document.createElement("div");
        element.classList.add(TILE_SIZE_CSS);
        element.classList.add(tileColors[i]);
        element.addEventListener("click", tileClick);

        mainDiv.appendChild(element);
    }
}

const tileClick = (event) => {
    const tiles = Array.from(mainDiv.children);

    const clearTile = tiles.filter(tile => tile.classList.contains(TILE_COLOR_CSS.CLEAR))[0];
    const clickedTile = event.target;

    if(isAdjacent(tiles, clearTile, clickedTile)){
        swapTileColor(clearTile, clickedTile);
        checkWin(tiles);
    }
}

const checkWin = (tiles) =>{
    const tileColorMap = new Map(Object.entries(TILE_COLOR_CSS));
    const iterator = tileColorMap.values();

    let result = iterator.next();
    while (!result.done) {

        const tilesSharingColor = tiles.filter(tile => tile.classList.contains(result.value));
        if(tilesSharingColor.length == 2){
            if(!isAdjacent(tiles, tilesSharingColor[0], tilesSharingColor[1])){
                return;
            }
        }
        
        result = iterator.next();
    }
    
    showWinMessage();
    disableAllclickEvents(tiles);
}

const showWinMessage = () => {
    const element = document.createElement("div");
    element.classList.add(MESSAGE_CSS);
    element.innerHTML = "Well done!";

    mainDiv.appendChild(element);
}

const disableAllclickEvents = (tiles) => {
    tiles.forEach(tile => tile.replaceWith(tile.cloneNode(true)));
}

const isAdjacent = (tiles, tile1, tile2) => {
    const tile1Idx = tiles.indexOf(tile1);
    const tile2Idx = tiles.indexOf(tile2);
    return Math.abs(tile1Idx - tile2Idx) == 3 ||
            (Math.abs(tile1Idx - tile2Idx) == 1 && Math.min(tile1Idx, tile2Idx)%3 != 2)
}

const swapTileColor = (tile1, tile2) => {
    const temp = tile1.className;
    tile1.className = tile2.className;
    tile2.className = temp; 
}

const shuffle = (array) => {
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

