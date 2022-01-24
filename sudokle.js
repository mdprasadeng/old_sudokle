var state = {
    width: 360*2,
    height: 360*2,
    unitSize: 80
};

var cell = [];
for (let i=0; i < 9; i++) {
    cell[i] =[];
    for (let j=0; j < 9; j++) {
        cell[i][j] = (i + j ) % 9 + 1;
    }
}    

function onLoad() {
    var canvas = document.getElementById('playarea');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        drawSudoku(ctx);
    } else {
        console.log("no canvas")
    }
}

function drawSudoku(ctx) {
    for (let i = 0; i <= 9; i++) {
        if (i==0 || i==9) {
            ctx.lineWidth = 10;    
        }
        else if (i==3 || i ==6) {
            ctx.lineWidth = 3;    
        } else {
            ctx.lineWidth = 1;    
        }
         
        ctx.beginPath();       
        ctx.moveTo(state.unitSize*i, 0);    
        ctx.lineTo(state.unitSize*i, state.height);  
        ctx.stroke();
    }
    for (let i = 0; i <= 9; i++) {
        if (i==0 || i==9) {
            ctx.lineWidth = 10;    
        }
        else if (i==3 || i ==6) {
            ctx.lineWidth = 3;    
        } else {
            ctx.lineWidth = 1;    
        }
        ctx.beginPath();  
        ctx.moveTo(0, state.unitSize*i, 0);    
        ctx.lineTo(state.width, state.unitSize*i);  
        ctx.stroke();
    }

    var diagWidth = 0.5;
    ctx.lineWidth = diagWidth;
    // top left 1
    for (let i = 0; i < 9; i++) {
        ctx.beginPath(); 
        ctx.moveTo(0, state.unitSize/2 + state.unitSize*i );
        ctx.lineTo(state.unitSize/2 + state.unitSize*i, 0);
        ctx.stroke();
    }

    // top left 2
    for (let i = 0; i < 9; i++) {
        ctx.beginPath(); 
        ctx.moveTo(state.unitSize/2 + state.unitSize*i, state.height );
        ctx.lineTo(state.width, state.unitSize/2 + state.unitSize*i);
        ctx.stroke();
    }

    // top right 1
    for (let i = 0; i < 9; i++) {
        ctx.beginPath(); 
        ctx.moveTo(state.unitSize/2 + state.unitSize*i ,0);
        ctx.lineTo(state.width, state.unitSize/2 + state.unitSize*(9-1 -i));
        ctx.stroke();
    }

    //top right 2
    for (let i = 0; i < 9; i++) {
        ctx.beginPath(); 
        ctx.moveTo(0, state.unitSize/2 + state.unitSize*i);
        ctx.lineTo(state.unitSize/2 + state.unitSize*(9-1 -i), state.height);
        ctx.stroke();
    }

    var fontSize = 30;
    ctx.font = fontSize+'px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";  
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            ctx.fillText(cell[i][j], state.unitSize/2 + state.unitSize*i, state.unitSize/2 + state.unitSize*j );
        }
    }

    var fontSize = 12;
    ctx.font = fontSize+'px monospace';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            ctx.fillText(cell[i][j], state.unitSize/2 + state.unitSize*i - state.unitSize/3, state.unitSize/2 + state.unitSize*j - state.unitSize/3);
            ctx.fillText(cell[i][j], state.unitSize/2 + state.unitSize*i - state.unitSize/3, state.unitSize/2 + state.unitSize*j + state.unitSize/3);
            ctx.fillText(cell[i][j], state.unitSize/2 + state.unitSize*i + state.unitSize/3, state.unitSize/2 + state.unitSize*j - state.unitSize/3);
            ctx.fillText(cell[i][j], state.unitSize/2 + state.unitSize*i + state.unitSize/3, state.unitSize/2 + state.unitSize*j + state.unitSize/3);

        }
    }

}