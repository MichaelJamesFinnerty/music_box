window.addEventListener("DOMContentLoaded", function (event) {
    ////start animation
    window.addEventListener("load", loadHandler);                

    //set the body and canvas dimensions
    document.body.style.width = window.innerWidth + "px";
    document.body.style.height = window.innerHeight*.99+ "px";

    var can = document.getElementById('canvas1');
    var ctx = can.getContext('2d');

    can.width = window.innerWidth;
    can.height = window.innerHeight*.99;

    ////set starting conditions (notes, tempo, grid dimensions, etc)

    //grid dimensions
    let gridHeight = can.height-75;
    let gridWidth = can.width-50;
    let cellHeight = (gridHeight)/16;
    let cellWidth = (gridWidth)/16;

    if (cellHeight < cellWidth) {
        cellWidth = cellHeight;
    } else {
        cellHeight = cellWidth;
    }

    //scale notes
    let notes = [
        'C2','D2','E2','G2','A2',
        'C3','D3','E3','G3','A3',
        'C4','D4','E4','G4','A4',
        'C5'
    ];

    let note_grid = [];

    //timing
    let start = Date.now();
    let tempo = 90;
    let interval = 60/tempo/4;
    let current_col = 0;
    drawFunction();        



    function loadHandler(){
        window.addEventListener("click", upHandler, false);

        document.querySelector('#bpm').addEventListener('input', function(e){
          tempo = e.target.value;
          interval = 60/tempo/4;    
          Tone.Transport.bpm.value = parseInt(tempo)
          document.querySelector('#bpmLabel').textContent = tempo;
        })        
    }      

    function upHandler(event){

        //capture the click data
        var ex = event.clientX-25;
        var ey = event.clientY-50;

        var gx = Math.floor(ex/cellWidth);
        var gy = 15-Math.floor(ey/cellHeight);

        console.log(ex, ey, gx, gy);

        let i = 0;
        for (n of note_grid) {
            //console.log(note_grid[i]);
            if (JSON.stringify(note_grid[i]) == JSON.stringify([gx, gy])){
                break;
            }
            i++;
        };

        if (i==note_grid.length){
            if (ex > 0 && ey > 0) {note_grid.push([gx, gy])};
        } else {
            note_grid.splice(i, 1);
        }

        console.log(note_grid);
    };


    function drawFunction(){

        //clear the canvas
        ctx.clearRect(0,0,can.width,can.height);

        //draw stuff
        drawGrid();

        //draw new frame
        window.requestAnimationFrame(drawFunction);

    }    

    function drawGrid(){

         //determine the current column
         let old_col = current_col;
         current_col = Math.floor(((Date.now() - start)/(interval*1000)) % 16);

         //when we switch to a new column, play the selected notes
         if (old_col != current_col){
             //run through each note_grid cell
             for (g of note_grid){
                 //play any that are in the current_col
                 if (current_col == g[0]){
                    //Tone.Transport.bpm.value = tempo;
                    let synth = new Tone.Synth().toMaster();
                    synth.triggerAttackRelease(notes[g[1]], '16n');
                 }
             }
         }

         for (a of [...Array(16).keys()]){
            for (b of [...Array(16).keys()]){

             ctx.beginPath();
             ctx.fillStyle = (a == current_col ? 'blue' : 'grey');
             ctx.strokeStyle=(a % 4 == 0 && a == current_col ? 'yellow' : 'black');
             ctx.lineWidth=(a % 4 == 0 && a == current_col ? 4 : 2);
             ctx.strokeRect(25+a*cellWidth, 25+b*cellHeight, cellWidth, cellHeight);
             ctx.fillRect(25+a*cellWidth, 25+b*cellHeight, cellWidth, cellHeight);
             ctx.closePath();
            }            
         }

        for (g of note_grid){
             ctx.beginPath();
             ctx.fillStyle = 'orange';
             ctx.strokeStyle='red'
             ctx.lineWidth=4;
             ctx.strokeRect(25+g[0]*cellWidth, 25+(15-g[1])*cellHeight, cellWidth, cellHeight);
             ctx.fillRect(25+g[0]*cellWidth, 25+(15-g[1])*cellHeight, cellWidth, cellHeight);
             ctx.closePath();
        }


    }    
});