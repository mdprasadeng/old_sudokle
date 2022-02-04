var ctx;
var canvas;
var dim = {
    unit: 70
}

var sx = 0;
var sy = 0;
var answer = [];
var correct = [];
var current = [];
var guessed = [];
var correctGrid = [];
var guessCounter = 0;


class State {
    constructor() {
        this.sx = 0;
        this.sy = 0;
        this.answerGrid = fillGrid();
        this.hitsGrid = newGrid(); //has all values which are HITs filled
        this.workingGrid = newGrid(); //has working values
        this.guessedGrids = []; //has array of guesses made
        this.checkedGrids = [];
        this.workingGridHistory = [];
        this.hitCount = 0;
        this.missCount = 0;
        this.closeCount = 0;

    }
}

function check(state) {

    var checkedGrid = checkGrid(state.workingGrid, state.answerGrid);
    state.guessedGrids.push(state.workingGrid);
    state.checkedGrids.push(checkedGrid);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!checkedGrid[i][j]) continue;
            switch (checkedGrid[i][j]) {
                case HIT:
                    if (!state.hitsGrid[i][j]) {
                        state.hitsGrid[i][j] = state.answerGrid[i][j];
                        state.hitCount++;
                    }
                    break;
                case MISS:
                    state.missCount++;
                    break;
                case CLOSE:
                    state.closeCount++;
                    break;
            }
        }
    }
    state.workingGrid = newGrid(state.hitsGrid);
}

function randFill(state, gridXY) {
    state.workingGrid = fillGrid(state.workingGrid, gridXY);
}

function logState(state) {
    logGrid(state.hitsGrid);
    console.log(`Guesses: ${state.guessedGrids.length} hits: ${state.hitCount} misses: ${state.missCount} close: ${state.closeCount}`)
}

var state;
function init() {
    state = new State();
}


function onLoad() {
    var screenWidth = window.screen.availWidth;
    var screenHeight = window.screen.availHeight;

    var canvasSize;
    if (screenWidth > screenHeight) {
        canvasSize = screenHeight * 0.6;
    } else {
        canvasSize = screenWidth - 10;
    }
    canvasSize = Math.floor(canvasSize/9) * 9;
    dim.unit = Math.floor(canvasSize / 9);
    canvas = document.getElementById('playarea');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown)
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        init()
        draw(state);
    } else {
        alert("Sorry, HTML Canvas is needed");
    }
}

function toPoint(evt) {
    var rect = evt.target.getBoundingClientRect();
    var x = evt.clientX - rect.left; //x position within the element.
    var y = evt.clientY - rect.top;  //y position within the element.
    return newPoint({ x: x, y: y });
}


function onMouseDown(evt) {
    downAt = toPoint(evt);
    state.sx = Math.floor(downAt.x / dim.unit);
    state.sy = Math.floor(downAt.y / dim.unit);
    draw(state);
}

function GetGuessOffset(g, i, j) {
    switch (g) {
        case 1: return newPoint({ x: dim.unit * i, y: dim.unit * j });
        case 2: return newPoint({ x: dim.unit * i + dim.unit, y: dim.unit * j });
        case 3: return newPoint({ x: dim.unit * i, y: dim.unit * j + dim.unit });
        case 4: return newPoint({ x: dim.unit * i + dim.unit, y: dim.unit * j + dim.unit });
        case 5: return newPoint({ x: dim.unit * i, y: dim.unit * j });
        case 6: return newPoint({ x: dim.unit * i + dim.unit, y: dim.unit * j });
        case 7: return newPoint({ x: dim.unit * i, y: dim.unit * j + dim.unit });
        case 8: return newPoint({ x: dim.unit * i + dim.unit, y: dim.unit * j + dim.unit });
    }
}

function GetGuessTextAt(g, i, j) {
    switch (g) {
        case 1: return newPoint({ x: dim.unit * i + dim.unit / 7, y: dim.unit * j + dim.unit / 6 });
        case 2: return newPoint({ x: dim.unit * (i + 1) - dim.unit / 7, y: dim.unit * j + dim.unit / 6 });
        case 3: return newPoint({ x: dim.unit * i + dim.unit / 7, y: dim.unit * (j + 1) - dim.unit / 6 });
        case 4: return newPoint({ x: dim.unit * (i + 1) - dim.unit / 7, y: dim.unit * (j + 1) - dim.unit / 6 });
        
        case 5: return newPoint({ x: dim.unit * i + dim.unit / 2, y: dim.unit * j + dim.unit / 7 });
        case 6: return newPoint({ x: dim.unit * (i + 1) - dim.unit / 7, y: dim.unit * j + dim.unit / 2 });
        case 7: return newPoint({ x: dim.unit * i + dim.unit / 7, y: dim.unit * (j + 1) - dim.unit / 2 });
        case 8: return newPoint({ x: dim.unit * (i + 1) - dim.unit / 2, y: dim.unit * (j + 1) - dim.unit / 7 });
    }
}


function draw(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Draw9x9
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var hitCell = state.hitsGrid[i][j];

            var fillColor = hitCell ? HIT_COLOR : null;

            var path = newPath({
                lineWidth: 1,
                points: GetSquarePath(),
                scaleBy: dim.unit,
                offset: newPoint({ x: dim.unit * i, y: dim.unit * j }),
                opacity: !fillColor ? 0.1 : 1,
                fillColor: fillColor
            });

            DrawPath(ctx, path);

        }
    }

    //Draw Selection
    var path = newPath({
        lineWidth: 1,
        points: GetSquarePath(),
        scaleBy: dim.unit,
        offset: newPoint({ x: dim.unit * state.sx, y: dim.unit * state.sy }),
        opacity: 0.66,
        fillColor: "yellow"
    });
    DrawPath(ctx, path);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var workingCell = state.workingGrid[i][j];
            if (workingCell) {
                DrawText(ctx, workingCell, 1.5, newPoint({ x: dim.unit * i + dim.unit / 2, y: dim.unit * j + dim.unit / 2 }))
            }

        }
    }

    //Draw9x9 guesses
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var correctGuesses = [];
            var subGrid = get3x3GridXY(i, j);
            for (var x = subGrid.startX; x <= subGrid.endX; x++) {
                for (var y = subGrid.startY; y <= subGrid.endY; y++) {
                    if (state.hitsGrid[x][y]) {
                        correctGuesses.push(state.hitsGrid[x][y]);
                    }
                }
            }

            var allGuesses = [];
            var allChecks = [];
            for (var g = 0; g < state.guessedGrids.length; g++) {
                var guessedGrid = state.guessedGrids[g];
                var checkedGrid = state.checkedGrids[g];
                var isGuessMade = !!guessedGrid[i][j];
                var isGuessValueAlreadyHit = isGuessMade && correctGuesses.indexOf(guessedGrid[i][j]) >= 0;
                var isGuessValueAlreadyGuessed = isGuessMade && allGuesses.indexOf(guessedGrid[i][j]) >= 0;
                if (isGuessMade && !isGuessValueAlreadyGuessed && !isGuessValueAlreadyHit) {
                    allGuesses.push(guessedGrid[i][j]);
                    allChecks.push(checkedGrid[i][j]);
                }
            }

            // if (i == 4 && j == 4) {
            //     allGuesses = [1,2,3,4,5,6,7,8];
            //     allChecks = [HIT, MISS, HIT, MISS, HIT, MISS, HIT, MISS];
            // }

            for (var g = 1; g <= allGuesses.length; g++) {
                var guess = allGuesses[g - 1];
                var check = allChecks[g - 1];
                var color;
                switch (check) {
                    case HIT:
                        color = HIT_COLOR;
                        break;
                    case CLOSE:
                        color = CLOSE_COLOR;
                        break;
                    case MISS:
                        color = MISS_COLOR;
                        break;
                }

                var path = newPath({
                    lineWidth: 1,
                    points: GetGuessPath(g),
                    offset: GetGuessOffset(g, i, j),
                    scaleBy: dim.unit / 2,
                    opacity: 1,
                    fillColor: color
                });
                DrawPath(ctx, path);
                DrawText(ctx, guess, g > 4 ? 0.7 : 0.9, GetGuessTextAt(g, i, j))
            }

        }
    }

    //Draw3x3
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            var path = newPath({
                lineWidth: 1,
                points: GetSquarePath(),
                scaleBy: dim.unit * 3,
                offset: newPoint({ x: dim.unit * i * 3, y: dim.unit * j * 3 })
            });
            DrawPath(ctx, path);
        }
    }

    // //Draw 9x9
    // var path = newPath({
    //     lineWidth: 5,
    //     points: GetSquarePath(),
    //     scaleBy: dim.unit * 9
    // });
    // DrawPath(ctx, path);

}

function drawStats(state) {
    document.getElementById("greenstat").innerHTML = state.hitCount;
    document.getElementById("graystat").innerHTML = state.closeCount;
    document.getElementById("whitestat").innerHTML = state.missCount;
    document.getElementById("tickstat").innerHTML = state.guessedGrids.length;
    
}

function onClear1x1() {
    var gridXY = new GridXY(state.sx, state.sx, state.sy, state.sy);
    clearState(gridXY);
}

function onClear3x3() {
    var gridXY = get3x3GridXY(state.sx, state.sy)
    clearState(gridXY);
}

function onClear9x9() {
    clearState(new GridXY())
}

function onRandom1x1() {
    var gridXY = new GridXY(state.sx, state.sx, state.sy, state.sy);
    randFillState(gridXY);
}

function onRandom3x3() {
    var gridXY = get3x3GridXY(state.sx, state.sy)
    randFillState(gridXY);
}

function onRandom9x9() {
    randFillState(new GridXY());
}

function onGuess() {
    
    var someGuessesAreMade = false;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (state.workingGrid[i][j] && !state.hitsGrid[i][j]) {
                someGuessesAreMade = true;
            }
        }
    }
    if (!someGuessesAreMade) return;
    check(state);
    draw(state);
    drawStats(state);
    if (state.hitCount == 81) {
        var elems = document.getElementsByClassName("btnsParent");
        for (let i = 0; i < elems.length; i++) {
            const elem = elems[i];
            elem.style.display = "none"
        }
    }
}

function clearState(gridXY) {
    state.workingGridHistory.push(newGrid(state.workingGrid));
    clearGrid(state.workingGrid, gridXY, state.hitsGrid);
    draw(state);
}

function randFillState(gridXY) {
    state.workingGridHistory.push(newGrid(state.workingGrid));
    state.workingGrid = fillGrid(state.workingGrid, gridXY);
    draw(state);
}

function onPressed(value) {
    value = Number(value);
    state.workingGridHistory.push(newGrid(state.workingGrid));
    state.workingGrid[state.sx][state.sy] = value;
    draw(state)
}

function onUndo() {
    if (state.workingGridHistory.length != 0) {
        state.workingGrid = state.workingGridHistory.pop();
    }
    draw(state);
}

function onKeyDown(key) {
    switch (key.key) {
        case "ArrowDown":
            state.sy = (state.sy + 1) % 9 
            draw(state);
            break;
        case "ArrowUp":
            state.sy = (state.sy - 1 + 9) % 9 
            draw(state);
            break;
        case "ArrowLeft":
            state.sx = (state.sx - 1 + 9) % 9 
            draw(state);
            break;
        case "ArrowRight":
            state.sx = (state.sx + 1) % 9 
            draw(state);
            break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            onPressed(key.key);
            break;
        case "Enter":
            onGuess();
            break;
    }
}