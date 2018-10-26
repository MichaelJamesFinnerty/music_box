function Animators(timing, cbPlaySound, noteGrid) {
    
    //set the canvas and context
    this.can            = document.getElementById('canvas1');
    this.ctx            = this.can.getContext('2d');

    //adjust canvas dimensions
    this.can.width = window.innerWidth;
    this.can.height = window.innerHeight*.95;

    //set counters to zero
    this.current_col    = 0;
    
    //set function arguments as parameters
    this.timing         = timing;
    this.cbPlaySound    = cbPlaySound;
    this.noteGrid         = noteGrid;
    
    //set the grid dimensions
    this.gridDimensions = {        
        gridHeight  : this.can.height-75,
        gridWidth   : this.can.width-50,
    };
    this.gridDimensions.shortAxis   = (this.gridDimensions.gridWidth < this.gridDimensions.gridHeight) ? 'X' : 'Y';
    
    this.gridDimensions.cellHeight  = (this.gridDimensions.shortAxis == 'X' ? 
                                       this.gridDimensions.gridWidth : 
                                       this.gridDimensions.gridHeight)/16;
    
    this.gridDimensions.cellWidth   = (this.gridDimensions.shortAxis == 'X' ? 
                                       this.gridDimensions.gridWidth : 
                                       this.gridDimensions.gridHeight)/16;
    
}

Animators.prototype.clearCtx = function (){
    //clear the canvas
    this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);    
}

Animators.prototype.updateColumn = function (){
     //determine the current column
     let old_col = this.current_col;
     this.current_col = Math.floor(((Date.now() - this.timing.start)/(this.timing.interval*1000)) % 16);    
     return (old_col != this.current_col ? true : false);
}

Animators.prototype.animateGrid = function (t){
    
    //console.log("drawGrid...........clearing Context");
    this.clearCtx();
    
    //console.log("drawGrid...........determining current_col and calling cbPlaySound");
    this.cbPlaySound(this.updateColumn(this.timing), this.current_col);

    //console.log("drawGrid...........drawing grid");
    this.drawGrid();
    
    //console.log("drawNotes..........drawing notes")
    this.drawNotes();
    
    window.requestAnimationFrame(() => this.animateGrid());
    
}

Animators.prototype.drawNotes = function() {
    for (g of this.noteGrid){
         this.ctx.beginPath();
         this.ctx.fillStyle = 'orange';
         this.ctx.strokeStyle='red'
         this.ctx.lineWidth=4;
         this.ctx.strokeRect(25+g[0]*this.gridDimensions.cellWidth, 25+(15-g[1])*this.gridDimensions.cellHeight, this.gridDimensions.cellWidth, this.gridDimensions.cellHeight);
         this.ctx.fillRect(25+g[0]*this.gridDimensions.cellWidth, 25+(15-g[1])*this.gridDimensions.cellHeight, this.gridDimensions.cellWidth, this.gridDimensions.cellHeight);
         this.ctx.closePath();
    }    
}

Animators.prototype.drawGrid = function() {
     for (a of [...Array(16).keys()]){
        for (b of [...Array(16).keys()]){
         this.ctx.beginPath();
         this.ctx.fillStyle = (a == this.current_col ? 'blue' : 'grey');
         this.ctx.strokeStyle=(a % 4 == 0 && a == this.current_col ? 'yellow' : 'black');
         this.ctx.lineWidth=(a % 4 == 0 && a == this.current_col ? 4 : 2);
         this.ctx.strokeRect(25+a*this.gridDimensions.cellWidth, 25+b*this.gridDimensions.cellHeight, this.gridDimensions.cellWidth, this.gridDimensions.cellHeight);
         this.ctx.fillRect(25+a*this.gridDimensions.cellWidth, 25+b*this.gridDimensions.cellHeight, this.gridDimensions.cellWidth, this.gridDimensions.cellHeight);
         this.ctx.closePath();
        }            
     }    
}