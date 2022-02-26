import Index2D from './Index2D.js';

export default class Model {

    constructor(rowSize) {
        this.rowSize = rowSize;
        this.initialize(rowSize);
    }

    initialize(level) {
        level = parseInt(level);

        {
            let arr = new Array();
        
            for(let i=1; i<level+2; i++){
                for(let c=1; c < level; c++){
                    arr.push(i);
                }
            }
            arr.push(0);
            const model = this.shuffle(arr);
            
            this.gridModel = this.chunk(model, parseInt(level));
        }while(this.hasWon());
        
    }

    changeRowSize(size){
        this.rowSize = size;
        this.initialize(this.rowSize);
    }

    getGridModel(){
        return this.gridModel;
    }

    getRowSize(){
        return this.rowSize;
    }

    get(idx2D){
        return this.gridModel[idx2D.x][idx2D.y];
    }

    set(idx2D, value){
        this.gridModel[idx2D.x][idx2D.y] = value;
    }

    updateOnTileClicked(clickedIdx2D, _render) {
        const zeroIdx2D = this.findIndex2DsByValue(0)[0];
        if(this.isAdjacent(clickedIdx2D,zeroIdx2D)){
            this.swap(clickedIdx2D, zeroIdx2D, _render);
            
        }
    }

    updateOnLevelClicked(level, _render){
        this.changeRowSize(level);
        _render(this.gridModel);
    }

    findIndex2DsByValue(value){
        let results = new Array();
        this.gridModel.forEach((row,idxX)=>{
            row.forEach((e,idxY)=>{
                if(e === value){
                    results.push(new Index2D(idxX, idxY));
                }
            });
        })
        return results;
    }

    chunk(arr, size) {
        let chunks=[];
        for(let i=0; i<arr.length; i+=size){
            chunks.push(arr.slice(i, i+size))
        }
        return chunks;
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

    isAdjacent(p1,p2){
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) === 1;
    }

    isConnected(arr){
        let clone = JSON.parse(JSON.stringify(arr));
        const grouped = new Array();
        grouped.push(clone.pop());
        let flag = undefined;
        while(clone.length>0){
            const last = clone.pop();
            if(grouped.some(e => this.isAdjacent(e,last))){
                grouped.push(last);
                flag = undefined;
                continue; 
            }
            if(flag && flag.x === last.x && flag.y === last.y){
                return false;
            }

            if(!flag) flag = last;
            
            clone.splice(0, 0, last);
        }
        return true;


    }

    swap(p1,p2, _render){
        const temp = this.get(p1);
        this.set(p1,this.get(p2));
        this.set(p2,temp);
        _render([p1,p2]);
    }

    hasWon(){
        const uniqueValues = this.gridModel.flat().filter((x, i, a) => a.indexOf(x) == i);
        
        return !uniqueValues.some(v =>{
            const idx2Ds = this.findIndex2DsByValue(v);
            return idx2Ds.length > 1 && !this.isConnected(idx2Ds);
        });

    }
}