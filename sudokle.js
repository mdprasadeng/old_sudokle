var ctx;
var canvas;
var dim = {
    unit: 80
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
    canvas = document.getElementById('playarea');
    canvas.addEventListener("mousedown", onMouseDown);

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        init()
        draw(state);
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
    sx = Math.floor(downAt.x / dim.unit);
    sy = Math.floor(downAt.y / dim.unit);
}

function GetGuessOffset(g, i, j) {
    switch (g) {
        case 1: return newPoint({ x: dim.unit * i, y: dim.unit * j });
        case 2: return newPoint({ x: dim.unit * i + dim.unit, y: dim.unit * j });
        case 3: return newPoint({ x: dim.unit * i, y: dim.unit * j + dim.unit });
        case 4: return newPoint({ x: dim.unit * i + dim.unit, y: dim.unit * j + dim.unit });
    }
}

function GetGuessTextAt(g, i, j) {
    switch (g) {
        case 1: return newPoint({ x: dim.unit * i + dim.unit / 6, y: dim.unit * j + dim.unit / 6 });
        case 2: return newPoint({ x: dim.unit * (i + 1) - dim.unit / 6, y: dim.unit * j + dim.unit / 6 });
        case 3: return newPoint({ x: dim.unit * i + dim.unit / 6, y: dim.unit * (j + 1) - dim.unit / 6 });
        case 4: return newPoint({ x: dim.unit * (i + 1) - dim.unit / 6, y: dim.unit * (j + 1) - dim.unit / 6 });
    }
}


function draw(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Draw9x9
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var hitCell = state.hitsGrid[i][j];

            var fillColor = hitCell ? "rgba(144, 238, 144, 150)" : null;

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
                DrawText(ctx, workingCell, 40, newPoint({ x: dim.unit * i + dim.unit / 2, y: dim.unit * j + dim.unit / 2 }))
            }

        }
    }

    // //Draw9x9 guesses
    // for (let i = 0; i < 9; i++) {
    //     for (let j = 0; j < 9; j++) {
    //         var gx = Math.floor(i/3);
    //         var gy = Math.floor(j/3);
    //         var correctGuesses = correctGrid[gx][gy];
            
    //         for (var g = 1; g <= guessed[i][j].length; g++) {
    //             var guess = guessed[i][j][g-1];
    //             if (guess.result == "hit") continue;
    //             if (correctGuesses.indexOf(guess.val) >= 0) continue;    
    //             var path = newPath({
    //                 lineWidth: 1,
    //                 points: GetGuessPath(g),
    //                 offset: GetGuessOffset(g, i, j),
    //                 scaleBy: dim.unit / 2,
    //                 opacity: 1,
    //                 fillColor: guess.getFillColor()
    //             });
    //             DrawPath(ctx, path);
    //             DrawText(ctx, guess.val, 20, GetGuessTextAt(g, i, j))
    //         }

    //     }
    // }

    //Draw3x3
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            var path = newPath({
                lineWidth: 3,
                points: GetSquarePath(),
                scaleBy: dim.unit * 3,
                offset: newPoint({ x: dim.unit * i * 3, y: dim.unit * j * 3 })
            });
            DrawPath(ctx, path);
        }
    }

    //Draw 9x9
    var path = newPath({
        lineWidth: 10,
        points: GetSquarePath(),
        scaleBy: dim.unit * 9
    });
    DrawPath(ctx, path);

}


function test() {
    randFill(state);
    check(state);
    draw(state);
}