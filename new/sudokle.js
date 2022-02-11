/** 
 * Draws a rounded rectangle using the current state of the canvas.  
 * If you omit the last three params, it will draw a rectangle  
 * outline with a 5 pixel border radius  
 * @param {Number} x The top left x coordinate 
 * @param {Number} y The top left y coordinate  
 * @param {Number} width The width of the rectangle  
 * @param {Number} height The height of the rectangle 
 * @param {Object} radius All corner radii. Defaults to 0,0,0,0; 
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false. 
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true. 
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: radius, upperRight: radius, lowerLeft: radius, lowerRight: radius };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
}
class Pnt {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

var config = {
    size1x: 65,
    gap: 6
}

var dim = {};
{
    dim.size1x = config.size1x;
    dim.size3x = dim.size1x * 3;
    dim.gap = config.gap;
    dim.btn1x = Math.floor((dim.size1x * 3 - dim.gap * 2) / 3);
    dim.width = dim.size1x * 9 + dim.gap * 2;
    dim.heigh = dim.width + dim.btn1x * 3 + dim.gap * 4;
    dim.statsY = dim.size3x * 3 + dim.gap * 3;
    dim.numbtnY = dim.size3x * 3 + dim.gap * 5 + dim.btn1x;
    dim.actbtnY = dim.size3x * 3 + dim.gap * 6 + dim.btn1x * 2;
    dim.border3x = 1;
}

console.log((dim.size1x * 3 - dim.gap * 2) / 3);

console.log(dim);

var tlwh = {}; //topleft and width height
{
    tlwh["tutorial"] = [new Pnt(0, dim.gap), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["sudokle"] = [new Pnt(dim.btn1x * 2 + dim.gap * 2, dim.gap), new Pnt(dim.size3x, dim.btn1x)];
    tlwh["guesscount"] = [new Pnt(dim.btn1x * 5 + dim.gap * 5, dim.gap), new Pnt(dim.btn1x * 2 + dim.gap, dim.btn1x)];
    tlwh["stats"] = [new Pnt(dim.btn1x * 7 + dim.gap * 7, dim.gap), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["settings"] = [new Pnt(dim.btn1x * 8 + dim.gap * 8, dim.gap), new Pnt(dim.btn1x, dim.btn1x)];

    tlwh["0x0"] = [new Pnt(0, dim.btn1x + dim.gap * 2), new Pnt(dim.size3x, dim.size3x)];
    tlwh["1x0"] = [new Pnt(dim.size3x + dim.gap, dim.btn1x + dim.gap * 2), new Pnt(dim.size3x, dim.size3x)];
    tlwh["2x0"] = [new Pnt(dim.size3x * 2 + dim.gap * 2, dim.btn1x + dim.gap * 2), new Pnt(dim.size3x, dim.size3x)];
    tlwh["0x1"] = [new Pnt(0, dim.size3x + dim.gap * 3 + dim.btn1x), new Pnt(dim.size3x, dim.size3x)];
    tlwh["1x1"] = [new Pnt(dim.size3x + dim.gap, dim.size3x + dim.gap * 3 + dim.btn1x), new Pnt(dim.size3x, dim.size3x)];
    tlwh["2x1"] = [new Pnt(dim.size3x * 2 + dim.gap * 2, dim.size3x + dim.gap * 3 + dim.btn1x), new Pnt(dim.size3x, dim.size3x)];
    tlwh["0x2"] = [new Pnt(0, dim.size3x * 2 + dim.gap * 4 + dim.btn1x), new Pnt(dim.size3x, dim.size3x)];
    tlwh["1x2"] = [new Pnt(dim.size3x + dim.gap, dim.size3x * 2 + dim.gap * 4 + dim.btn1x), new Pnt(dim.size3x, dim.size3x)];
    tlwh["2x2"] = [new Pnt(dim.size3x * 2 + dim.gap * 2, dim.size3x * 2 + dim.gap * 4 + dim.btn1x), new Pnt(dim.size3x, dim.size3x)];


    tlwh["numbtn1"] = [new Pnt(0, dim.numbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["numbtn2"] = [new Pnt(dim.btn1x * 1 + dim.gap * 1, dim.numbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["numbtn3"] = [new Pnt(dim.btn1x * 2 + dim.gap * 2, dim.numbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["numbtn4"] = [new Pnt(dim.btn1x * 3 + dim.gap * 3, dim.numbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["numbtn5"] = [new Pnt(dim.btn1x * 4 + dim.gap * 4, dim.numbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["numbtn6"] = [new Pnt(dim.btn1x * 5 + dim.gap * 5, dim.numbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["numbtn7"] = [new Pnt(dim.btn1x * 6 + dim.gap * 6, dim.numbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["numbtn8"] = [new Pnt(dim.btn1x * 7 + dim.gap * 7, dim.numbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["numbtn9"] = [new Pnt(dim.btn1x * 8 + dim.gap * 8, dim.numbtnY), new Pnt(dim.btn1x, dim.btn1x)];

    // tut stats settings
    //  space undo del rand space guess:eye space
    // undo del rand guessguessguess stats settings tut    

    //tlwh["undobtn"] = [new Pnt(0, dim.actbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["delbtn"] = [new Pnt(dim.btn1x + dim.gap, dim.actbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["randbtn"] = [new Pnt(dim.btn1x * 2 + dim.gap * 2, dim.actbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    tlwh["guessbtn"] = [new Pnt(dim.btn1x * 3 + dim.gap * 3, dim.actbtnY), new Pnt(dim.size3x, dim.btn1x)];
    tlwh["statsbtn"] = [new Pnt(dim.btn1x * 6 + dim.gap * 6, dim.actbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    //tlwh["settingsbtn"] = [new Pnt(dim.btn1x * 7 + dim.gap * 7, dim.actbtnY), new Pnt(dim.btn1x, dim.btn1x)];
    //tlwh["tutorialbtn"] = [new Pnt(dim.btn1x * 8 + dim.gap * 8, dim.actbtnY), new Pnt(dim.btn1x, dim.btn1x)];


}

var colors = {
    hit: "rgba(106, 170, 100, 1)",
    miss: "rgba(120, 124, 126, 1)",
    close: "rgba(201, 180, 88, 1)",
    grid: "#FFFFFF",
    gridAlt: "#EEEEEE",
    btn: "#d3d6da"
}

var tlwhRoundCorners = {};
for (const key in tlwh) {
    if (key.indexOf("btn") >= 0) {
        tlwhRoundCorners[key] = 5;
    } else {
        tlwhRoundCorners[key] = 0;
    }
}


var tlwhStrokes = {};
for (const key in tlwh) {
    if (key.indexOf("btn") >= 0) {
        tlwhStrokes[key] = 0;
    } else {
        tlwhStrokes[key] = dim.border3x;
    }
}


var tlwhFills = {};
{
    for (const key in tlwh) {
        if (key.indexOf("btn") >= 0) {
            tlwhFills[key] = colors.btn;
        } else {
            tlwhFills[key] = colors.grid;
        }
    }
    var grays = ["1x0", "0x1", "2x1", "1x2"];
    for (const key in grays) {
        tlwhFills[grays[key]] = colors.gridAlt;
    }
}
var tlwhText = {};
for (const key in tlwh) {
    tlwhText[key] = key;
}

var ctx;
var canvas;



function walkPath(ctx, points, close = true) {
    ctx.beginPath();

    for (let i = 0; i < points.length; i++) {
        var point = points[i];
        if (i == 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    }
    if (close)
        ctx.closePath();
}

function DrawText(ctx, text, fontSize, at, fontColor) {
    ctx.save();
    ctx.fillStyle = fontColor;
    ctx.font = fontSize + "em Roboto";
    ctx.fillText(text, at.x, at.y);
    ctx.restore();
}


function rawDraw(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = dim.border3x;
    for (const key in tlwh) {
        let tl = tlwh[key][0];
        let wh = tlwh[key][1];
        if (tlwhRoundCorners[key] > 0) {
            if (tlwhFills[key]) {
                ctx.save();
                ctx.fillStyle = tlwhFills[key];
                ctx.roundRect(tl.x, tl.y, wh.x, wh.y, tlwhRoundCorners[key], true, false);
                ctx.restore();
            }
        } else {
            walkPath(ctx, [
                tl,
                new Pnt(tl.x + wh.x, tl.y),
                new Pnt(tl.x + wh.x, tl.y + wh.y),
                new Pnt(tl.x, tl.y + wh.y),
            ]);
            if (tlwhStrokes[key] > 0) {
                ctx.save();
                ctx.lineWidth = tlwhStrokes[key];
                ctx.stroke();
                ctx.restore();
            }
            if (tlwhFills[key]) {
                ctx.save();
                ctx.fillStyle = tlwhFills[key];
                ctx.fill();
                ctx.restore();
            }
        }




    }

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