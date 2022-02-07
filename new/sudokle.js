var ctx;
var canvas;
var dim = {
    border3x: 1,
    border1x: 0.25,
    gap3x: 10,
    unit3x: 186,
    unit: 62
}
var colors = {
    border1x: "#000000",
    border3x: "#000000"
}

var grids = [
    new Point(0, 0),
    new Point(0, 1),
    new Point(0, 2),
    new Point(1, 0),
    new Point(1, 1),
    new Point(1, 2),
    new Point(2, 0),
    new Point(2, 1),
    new Point(2, 2),
]

dim.btnunit = Math.floor((dim.unit * 9 + dim.gap3x * 2 - dim.gap3x * 8) / 9);

var gridsXY = grids.map(
    p => new Point(
        dim.unit3x * p.x + (p.x >= 0 ? dim.gap3x * p.x : 0),
        dim.unit3x * p.y + (p.y >= 0 ? dim.gap3x * p.y : 0)
    ))

var width = dim.gap3x * 6 + dim.unit * 9 + dim.border1x * 18;
var height = dim.gap3x * 8 + dim.unit * 12 + dim.border1x * 24;

console.log("Canvas should be size:" + width + "x" + height);

function rawDraw(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(0.5, 0.5)
    gridsXY.forEach(p => {
        ctx.translate(p.x, p.y);
        ctx.lineWidth = dim.border3x;
        walkPath(ctx, [new Point(0, 0),
        new Point(dim.unit3x, 0),
        new Point(dim.unit3x, dim.unit3x),
        new Point(0, dim.unit3x)
        ])
        ctx.stroke();

        ctx.lineWidth = dim.border1x;
        walkPath(ctx, [new Point(dim.unit, 0), new Point(dim.unit, dim.unit3x)], false);
        ctx.stroke();
        walkPath(ctx, [new Point(dim.unit * 2, 0), new Point(dim.unit * 2, dim.unit3x)], false);
        ctx.stroke();
        walkPath(ctx, [new Point(0, dim.unit), new Point(dim.unit3x, dim.unit)], false);
        ctx.stroke();
        walkPath(ctx, [new Point(0, dim.unit * 2), new Point(dim.unit3x, dim.unit * 2)], false);
        ctx.stroke();


        ctx.translate(-p.x, -p.y);

    });

    var width = dim.unit3x * 3 + dim.gap3x * 2;
    var yoff = dim.unit3x * 3 + dim.gap3x * 3;
    ctx.lineWidth = dim.border3x;
    walkPath(ctx, [
        new Point(0, yoff),
        new Point(dim.unit3x, yoff),
        new Point(dim.unit3x, yoff + dim.unit),
        new Point(0, yoff + dim.unit)
    ])
    ctx.stroke();
    DrawText(ctx, "Sudokle #024", 1.5, new Point(dim.unit3x * 0.45 + dim.gap3x, dim.unit3x * 3 + dim.gap3x * 3 + dim.unit / 2));

    yoff += Math.floor((dim.unit - dim.btnunit)/2);
    [3, 4, 5].forEach((num, index) => {
        console.log(num)
        var x = num * (dim.btnunit + dim.gap3x);
        walkPath(ctx, [
            new Point(x, yoff),
            new Point(x + dim.btnunit, yoff),
            new Point(x + dim.btnunit, yoff + dim.btnunit),
            new Point(x, yoff + dim.btnunit)
        ]);
        ctx.stroke();
    });



    var numY = dim.unit3x * 3 + dim.unit + dim.gap3x * 4;
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((num, index) => {
        var x = index * (dim.btnunit + dim.gap3x);
        walkPath(ctx, [
            new Point(x, numY),
            new Point(x + dim.btnunit, numY),
            new Point(x + dim.btnunit, numY + dim.btnunit),
            new Point(x, numY + dim.btnunit)
        ])
        ctx.stroke();
        DrawText(ctx, num * 100, 1, new Point(x + dim.btnunit / 2, numY + dim.btnunit / 2))
    });

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
    state.workingGridHistory = [];
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
var gif;
function init() {
    state = new State();
}


function onLoad() {



    var screenWidth = window.screen.availWidth;
    var screenHeight = window.screen.availHeight;

    canvas = document.getElementById('playarea');
    var canvasSize = canvas.width;

    gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvasSize,
        height: canvasSize,
        debug: true
    });

    canvas.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown)
    if (canvas.getContext) {
        let myFont = new FontFace(
            "Roboto",
            "url(./roboto.woff2)"
        );

        myFont.load().then((font) => {
            document.fonts.add(font);
            console.log("Font loaded");

            ctx = canvas.getContext('2d');
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            init()
            //draw(state);
            rawDraw(state);
        });


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
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
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
                opacity: !fillColor ? 0.4 : 1,
                fillColor: fillColor
            });

            DrawPath(ctx, path);

        }
    }

    if (state.hitCount != 81) {
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

    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var workingCell = state.workingGrid[i][j];
            var hitCell = state.hitsGrid[i][j];
            if (workingCell) {
                var fontColor = hitCell != undefined ? "#ffffff" : "#000000";
                console.log(hitCell + fontColor);
                DrawText(ctx, workingCell, 1.5, newPoint({ x: dim.unit * i + dim.unit / 2, y: dim.unit * j + dim.unit / 2 }), fontColor)
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

                var offset = GetGuessOffset(g, i, j);
                var path = newPath({
                    lineWidth: 1,
                    points: GetGuessPath(g, dim.unit / 2, 0),
                    offset: offset,
                    scaleBy: 1,
                    opacity: 1,
                    fillColor: color
                });
                DrawPath(ctx, path, true);
                DrawText(ctx, guess, g > 4 ? 0.7 : 0.9, GetGuessTextAt(g, i, j), "#ffffff")
            }

        }
    }

    //Draw3x3
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            var path = newPath({
                lineWidth: 2,
                points: GetSquarePath(),
                scaleBy: dim.unit * 3,
                offset: newPoint({ x: dim.unit * i * 3, y: dim.unit * j * 3 }),
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
    gif.addFrame(ctx, { delay: 500, copy: true });

    drawStats(state);
    if (state.hitCount == 81) {
        gif.on('finished', function (blob) {
            console.log("gif finished")
            window.open(URL.createObjectURL(blob));
        });
        gif.render();

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