var state = {
    width: 360 * 2,
    height: 360 * 2,
    unitSize: 80,
    answer: grid(),
    guess: [],
    currentGuess: [],
    correctGuess: [],
    sx : 0,
    sy: 0,
};

var textAt = state.unitSize/6;
var lineAt = state.unitSize/2;
var unitSize = state.unitSize;

var guessPath = [];
guessPath.push({
    tx : textAt,
    ty : textAt,
    path: [ 
        {x: 0,y: 0},
        {x: lineAt,y: 0},
        {x: 0,y: lineAt}
    ]
});
guessPath.push({
    tx : unitSize - textAt,
    ty : textAt,
    path: [ 
        {x: unitSize,y: 0},
        {x: unitSize,y: lineAt},
        {x: unitSize - lineAt,y: 0}
    ]
});
guessPath.push({
    tx : textAt,
    ty : unitSize - textAt,
    path: [ 
        {x: 0,y: unitSize},
        {x: lineAt,y: unitSize},
        {x: 0,y: unitSize - lineAt}
    ]
});
guessPath.push({
    tx : unitSize - textAt,
    ty : unitSize - textAt,
    path: [ 
        {x: unitSize,y: unitSize},
        {x: unitSize - lineAt,y: unitSize},
        {x: unitSize,y: unitSize - lineAt}
    ]
});

for (let i = 0; i < 9; i++) {
    state.guess[i] = [];
    state.currentGuess[i] = [];
    state.correctGuess[i] = [];
    for (let j = 0; j < 9; j++) {
        state.guess[i][j] = [];
        state.currentGuess[i][j] = -1;
        state.correctGuess[i][j] = -1;
    }
}

function OnGuess() {
    var csx = Math.floor(state.sx / 3) * 3;
    var csy = Math.floor(state.sy / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state.currentGuess[csx + i][csy + j] == -1) {
                console.log("")
                return;
            }
        }
    }



    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            var val = state.currentGuess[csx + i][csy + j];
            state.currentGuess[csx + i][csy + j] = -1; 
            if (val == state.answer[csx + i][csy + j]) {
                state.guess[csx + i][csy + j].push({ val: val, result: "hit" })
                state.correctGuess[csx + i][csy + j] = val; 
                state.currentGuess[csx + i][csy + j] = val; 
            } else {
                var close = false;
                for (let ti = 0; ti < 3; ti++) {
                        if (val == state.answer[csx+ ti][csy] || val == state.answer[csx][csy + ti]) {
                            close = true;
                            state.guess[csx + i][csy + j].push({ val: val, result: "close" })
                        }
                    
                }
                if (!close) {
                    state.guess[csx + i][csy + j].push({ val: val, result: "miss" })
                }
            }
        }
    }
    reDraw();
}

function onLoad() {
    reDraw();
    document.onkeydown = keyDown;
}


function keyDown(key) {
    switch (key.key) {
        case "ArrowDown":
            state.sy = (state.sy + 1 + 9) % 9;
            reDraw();
            break;
        case "ArrowUp":
            state.sy = (state.sy - 1 + 9) % 9;
            reDraw();
            break;
        case "ArrowRight":
            state.sx = (state.sx + 1) % 9;
            reDraw();
            break;
        case "ArrowLeft":
            state.sx = (state.sx - 1 + 9) % 9;
            reDraw();
            break;
        case "Shift":
            isShiftDown = true;
            break;
        case "Enter":
            OnGuess();
            break;
        case "1":
            state.currentGuess[state.sx][state.sy] = 1;
            reDraw();
            break;
        case "2":
            state.currentGuess[state.sx][state.sy] = 2;
            reDraw();
            break;
        case "3":
            state.currentGuess[state.sx][state.sy] = 3;
            reDraw();
            break;
        case "4":
            state.currentGuess[state.sx][state.sy] = 4;
            reDraw();
            break;
        case "5":
            state.currentGuess[state.sx][state.sy] = 5;
            reDraw();
            break;
        case "6":
            state.currentGuess[state.sx][state.sy] = 6;
            reDraw();
            break;
        case "7":
            state.currentGuess[state.sx][state.sy] = 7;
            reDraw();
            break;
        case "8":
            state.currentGuess[state.sx][state.sy] = 8;
            reDraw();
            break;
        case "9":
            state.currentGuess[state.sx][state.sy] = 9;
            reDraw();
            break;
    }
}


function reDraw() {
    var canvas = document.getElementById('playarea');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'middle'; 
        ctx.textAlign = 'center'; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw9x9At(0, 0, ctx);
    } else {
        console.log("no canvas")
    }
}

function draw9x9At(x, y, ctx) {
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.rect(0, 0, 9 * state.unitSize, 9 * state.unitSize);
    ctx.stroke()

    for (let i=0; i < 3; i++) {
        for (let j=0; j < 3; j++) {
            if (i == Math.floor(state.sx / 3) && j == Math.floor(state.sy / 3)) {
                ctx.globalAlpha = 1;
                draw3x3At(i, j , ctx, true);
            } else {
               ctx.globalAlpha = 0.2; 
               draw3x3At(i, j , ctx, false);    
            }
        }
    }
    
    ctx.translate(-1 * x, -1* y );   
}

function draw3x3At(x, y, ctx, selected) {
    ctx.translate(x * 3 * state.unitSize, y * 3 * state.unitSize);

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.rect(0, 0, 3 * state.unitSize, 3 * state.unitSize);
    ctx.stroke()

    for (let i=0; i < 3; i++) {
        for (let j=0; j < 3; j++) {
            draw1x1At(i, j , ctx, selected, x, y);
        }
    }
    
    ctx.translate(-1 * x * 3 * state.unitSize, -1 * y * 3 * state.unitSize);
}

function draw1x1At(x,y, ctx, selected, px, py) {
    ctx.translate(x * state.unitSize, y * state.unitSize);
    if (selected && x == (state.sx % 3) && y == (state.sy % 3)) {
        console.log("yellow at" + state.sx + ":" + state.sy);
        ctx.save();
        ctx.fillStyle = "yellow"
        ctx.fill(); 
        ctx.restore();  
    }

    {
        var guesses = state.guess[px*3 + x][py*3 + y];
        for (let i=0; i < Math.min(4, guesses.length); i++) {
            var gPath  = guessPath[i];
            var guess = guesses[i];
            if (guess.result == "hit") {
                ctx.fillStyle = "rgba(144, 238, 144, 150)";
            }
            if (guess.result == "close") {
                ctx.fillStyle = "rgba(211,211,211, 150)";
            }
            if (guess.result == "miss") {
                ctx.fillStyle = "rgba(255, 255, 255, 150)";
            } 

            ctx.beginPath()
            ctx.moveTo(gPath.path[0].x, gPath.path[0].y)
            ctx.lineTo(gPath.path[1].x, gPath.path[1].y)
            ctx.lineTo(gPath.path[2].x, gPath.path[2].y)
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            
            ctx.fillStyle = "black"
            ctx.font = "15px Arial"; // To change font size and type
            ctx.fillText(guess.val, gPath.tx, gPath.ty)
        }

    }
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.rect(0, 0, state.unitSize, state.unitSize);
    ctx.stroke()
    

    var currentGuess = state.currentGuess[px*3+x][py*3+y];
    if (currentGuess > 0) {
        ctx.fillStyle = "black"
        ctx.font = "25px Arial"; // To change font size and type
        ctx.fillText(currentGuess, unitSize/2, unitSize/2);
    }

    

    ctx.translate(-1 * x * state.unitSize, -1 * y * state.unitSize);
}

