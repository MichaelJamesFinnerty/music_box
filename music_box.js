window.addEventListener("DOMContentLoaded", function (event) {
    ////start animation
    window.addEventListener("load", loadHandler);                

    //set the body and canvas dimensions
    document.body.style.width = window.innerWidth + "px";
    document.body.style.height = window.innerHeight*.99+ "px";

    function loadHandler(){
        document.querySelector('#bpm').addEventListener('input', function(e){
          tempo = e.target.value;
          interval = 60/tempo/4;    
          Tone.Transport.bpm.value = parseInt(tempo)
          document.querySelector('#bpmLabel').textContent = tempo;
        })        
    }      

    console.log("DOMContentLoaded...creating MusicBoxManager");
    window.requestAnimationFrame(function () {
      new MusicBoxManager(Animators, inputHandler);
    });

    
});


function MusicBoxManager(Animators, inputHandler) {   
    this.timeSettings   = {
        start       : Date.now(),
        tempo       : 90,
    };
    this.timeSettings.interval  = 60/this.timeSettings.tempo/4

    this.seqrManager    = new SeqrManager;
    this.animators      = new Animators(this.timeSettings, this.playSound.bind(this), this.seqrManager.note_grid);
    this.inputHandler   = new inputHandler(this.seqrManager.note_grid, this.animators.gridDimensions);
    
    this.inputHandler.on("click", this.click.bind(this));
    
    console.log("MusicBoxManger.....calling Animators.drawGrid for first time");
    window.requestAnimationFrame(() => this.animators.animateGrid());
    
};

MusicBoxManager.prototype.playSound = function(trigger) {
    //console.log("playSound..........");
    //when we switch to a new column, play the selected notes
    if (trigger){
        //run through each note_grid cell
        for (g of this.seqrManager.note_grid){
            //play any that are in the current_col
            if (this.animators.current_col == g[0]){
                //Tone.Transport.bpm.value = tempo;
                let synth = new Tone.Synth().toMaster();
                synth.triggerAttackRelease(this.seqrManager.notes[g[1]], '16n');
            }
        }
    }
};

MusicBoxManager.prototype.checkNoteInNoteGrid = function (){
    //set counters to zero
    var noteGridCounter = 0;
    console.log(this.seqrManager.note_grid);
    //look through note grid to determine if the note already exists
    for (n of this.seqrManager.note_grid) {
        //console.log(note_grid[i]);
        if (JSON.stringify(this.seqrManager.note_grid[noteGridCounter]) == JSON.stringify([this.gx, this.gy])){
            break;
        }
        noteGridCounter++;
    };
    return (noteGridCounter==this.seqrManager.note_grid.length ? true : false);
};

MusicBoxManager.prototype.addNoteToNoteGrid = function (){
        if (this.ex > 0 && this.ey > 0) {this.seqrManager.note_grid.push([this.gx, this.gy])};
};

MusicBoxManager.prototype.removeNoteFromNoteGrid = function (){
        this.seqrManager.noteGrid.splice(this.noteGridCounter, 1);
};

MusicBoxManager.prototype.click = function (event){
    //capture the click data
    this.ex             = event.clientX-25;
    this.ey             = event.clientY-50;
    this.gx             = Math.floor(this.ex/this.animators.gridDimensions.cellWidth);
    this.gy             = 15-Math.floor(this.ey/this.animators.gridDimensions.cellHeight);

    //this.checkNoteInNoteGrid();
    console.log(this.ex, this.ey, this.gx, this.gy);
    
    if (this.checkNoteInNoteGrid()){
        this.addNoteToNoteGrid();
    } else {
        this.removeNoteFromNoteGrid();
    }

    console.log(this.seqrManager.note_grid);    
}


function SeqrManager() {
    this.note_grid  = [];    
    this.notes      = ['C2','D2','E2','G2','A2','C3','D3','E3',
                       'G3','A3','C4','D4','E4','G4','A4','C5'];
};

