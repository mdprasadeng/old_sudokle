class Pnt {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

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
CanvasRenderingContext2D.prototype.walkRoundRect = function (xy, wh, radius) {
    var cornerRadius = { upperLeft: radius, upperRight: radius, lowerLeft: radius, lowerRight: radius };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }
    var x = xy.x;
    var y = xy.y;
    var width = wh.x;
    var height = wh.y;

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

}

CanvasRenderingContext2D.prototype.walkRect = function (xy, wh) {

    var x = xy.x;
    var y = xy.y;
    var width = wh.x;
    var height = wh.y;

    this.beginPath();
    this.moveTo(x, y);
    this.lineTo(x + width, y);
    this.lineTo(x + width, y + height);
    this.lineTo(x, y + height);
    this.closePath();

}

CanvasRenderingContext2D.prototype.walkPath = function (points, closePath = true) {
    this.beginPath();

    for (let i = 0; i < points.length; i++) {
        var point = points[i];
        if (i == 0) {
            this.moveTo(point.x, point.y);
        } else {
            this.lineTo(point.x, point.y);
        }
    }
    if (closePath)
        this.closePath();
}


CanvasRenderingContext2D.prototype.drawText = function (text, at, fontSize, fillStyle) {
    this.fillStyle = fillStyle;
    this.font = fontSize + "px Roboto";
    this.fillText(text, at.x, at.y);
}

CanvasRenderingContext2D.prototype.fillWStyle = function (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
}

CanvasRenderingContext2D.prototype.strokeWStyle = function (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
}

var config = {
    unit: 65,
    gap: 6
}


var dim = {};
{
    dim.unit = config.unit;
    dim.box = dim.unit * 3;
    dim.gap = config.gap;
    dim.btn = Math.floor((dim.box - dim.gap * 2) / 3);
    dim.text = Math.floor((dim.btn - dim.gap * 2)) / 2;
}

var colors = {
    hit: "rgba(106, 170, 100, 1)",
    miss: "rgba(120, 124, 126, 1)",
    close: "rgba(201, 180, 88, 1)",
    unitStroke: "#000000",
    unitAltStroke: "#000000",
    unit: "#FFFFFF",
    unitAlt: "#AAAAAA",
    btn: "#d3d6da",
    btntxt: "#000000",
    txt: "#000000",
    debug: "#AA0000",
}
var ctx;
var canvas;

class State {
    constructor() {
        this.puzzleNo = 123;
        this.sx = 0;
        this.sy = 0;
        this.answerGrid = fillGrid();
        this.hitsGrid = newGrid(); //has all values which are HITs filled
        this.workingGrid = newGrid(); //has working values
        this.guessesGrid = newGrid();
        this.guessedGrids = []; //has array of guesses made
        this.checkedGrids = [];
        this.workingGridHistory = [];
        this.hitCount = 0;
        this.missCount = 0;
        this.closeCount = 0;

    }
}



function walkAndDraw(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.translate(0.5, 0.5)

    var offx = 0;
    var offy = 0;
    var x = offx;
    var y = offy;
    var lx = x;
    var ly = y;
    var w;
    var h;
    var t;
    // header
    {
        //tutorial ?
        lx = x, ly = y, w = dim.unit, h = dim.unit;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 5);
        //ctx.fillWStyle(colors.btn);
        ctx.drawText("?", new Pnt(lx + w / 2, ly + h / 2), dim.text + 10, colors.txt);
        x += w;

        //settings ⚙
        lx = x, ly = y, w = dim.unit, h = dim.unit;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 5);
        //ctx.fillWStyle(colors.btn);
        ctx.drawText("⚙", new Pnt(lx + w / 2, ly + h / 2), dim.text + 20, colors.txt);


        //Sudokle #No
        x = dim.box + dim.gap;
        lx = x, ly = y, w = dim.box, h = dim.unit;
        ctx.walkRect(new Pnt(lx, ly), new Pnt(w, h), 5);
        ctx.strokeWStyle(colors.debug);
        ctx.drawText("Sudokle #" + state.puzzleNo, new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.txt);
        x += w;
        x += dim.gap;


        //yellow and gray count
        lx = x, ly = y, w = dim.unit, h = dim.unit;
        ctx.walkRect(new Pnt(lx, ly), new Pnt(w, h), 5);
        ctx.strokeWStyle(colors.debug);
        ctx.drawText("79", new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.txt);
        x += w;
        x += dim.gap;
        x += dim.btn + dim.gap;

        //streak 📊
        x = dim.box * 3 + dim.gap * 2 - dim.unit;
        lx = x, ly = y, w = dim.unit, h = dim.unit;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 5);
        //ctx.fillWStyle(colors.btn);
        ctx.drawText("📊", new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.txt);
        x += w;
        x += dim.gap;

    }
    x = offx;
    y = offy + dim.unit + dim.gap

    {
        for (let bi = 0; bi < 3; bi++) {
            for (let bj = 0; bj < 3; bj++) {
                var stroke = colors.unitStroke;
                var fill = colors.unit;

                ctx.lineWidth = 0.75;

                lx = x + bi * dim.box + (bi > 0 ? (bi) * dim.gap : 0);
                ly = y + bj * dim.box + (bj > 0 ? (bj) * dim.gap : 0);
                w = dim.box, h = dim.box;
                ctx.walkRect(new Pnt(lx, ly), new Pnt(w, h));
                ctx.strokeWStyle(stroke);
                
                

                for (let ui = 0; ui < 3; ui++) {
                    for (let uj = 0; uj < 3; uj++) {
                        let gx = bi * 3 + ui;
                        let gy = bj * 3 + uj;
                        let hit = state.hitsGrid[gx][gy];
                        let txt = state.workingGrid[gx][gy];

                        lx = x + bi * dim.box + ui * dim.unit + (bi > 0 ? (bi) * dim.gap : 0);
                        ly = y + bj * dim.box + uj * dim.unit + (bj > 0 ? (bj) * dim.gap : 0);
                        w = dim.unit, h = dim.unit;



                        if (!!hit) {
                            ctx.walkRect(new Pnt(lx, ly), new Pnt(w, h));
                            ctx.fillWStyle(colors.hit);            
                        }
                        if (!!txt) {
                            ctx.drawText("" + txt, new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.btntxt);
                        }
                    }
                }

                ctx.lineWidth = 0.25;

                lx = x + bi * dim.box + (bi > 0 ? (bi) * dim.gap : 0);
                ly = y + bj * dim.box + (bj > 0 ? (bj) * dim.gap : 0);
                
                ctx.walkPath([new Pnt(lx + dim.unit, ly), new Pnt(lx + dim.unit, ly + dim.box)], false);
                ctx.strokeWStyle(stroke)

                ctx.walkPath([new Pnt(lx + 2 * dim.unit, ly), new Pnt(lx + 2 * dim.unit, ly + dim.box)], false);
                ctx.strokeWStyle(stroke)

                ctx.walkPath([new Pnt(lx, ly + dim.unit), new Pnt(lx + dim.box, ly + dim.unit)], false);
                ctx.strokeWStyle(stroke)

                ctx.walkPath([new Pnt(lx, ly + 2 * dim.unit), new Pnt(lx + dim.box, ly + 2 * dim.unit)], false);
                ctx.strokeWStyle(stroke)
                


            }
        }
    }

    x = offx;
    y += dim.box * 3 + dim.gap * 3;

    {
        ly = y;
        for (let n = 1; n <= 9; n++) {
            lx = x;
            w = dim.btn, h = dim.btn;
            ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
            ctx.fillWStyle(colors.btn);
            ctx.drawText("" + n, new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.btntxt);
            x += dim.btn + dim.gap;
        }
    }
    x = offx;
    y += dim.btn + dim.gap;

    {
        ly = y;

        x += dim.btn + dim.gap;
        lx = x;
        w = dim.btn, h = dim.btn;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("⟲", new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.btntxt);
        x += dim.btn + dim.gap;

        lx = x;
        w = dim.btn, h = dim.btn;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("␡", new Pnt(lx + w / 2, ly + h / 2), dim.text * 2, colors.btntxt);
        x += dim.btn + dim.gap;

        lx = x;
        w = dim.box, h = dim.btn;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("Enter", new Pnt(lx + w / 2, ly + h / 2), dim.text + 5, colors.btntxt);
        x += dim.box + dim.gap;

        lx = x;
        w = dim.btn, h = dim.btn;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("🎲", new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.btntxt);
        x += dim.btn + dim.gap;

        lx = x;
        w = dim.btn, h = dim.btn;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("🎲", new Pnt(lx + w / 2, ly + h / 2), dim.text + 20, colors.btntxt);
        x += dim.btn + dim.gap;


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
    if (true) {
        state = { "puzzleNo": 345, "sx": 0, "sy": 0, "answerGrid": [[4, 2, 7, 3, 8, 6, 9, 5, 1], [6, 1, 3, 7, 9, 5, 2, 8, 4], [9, 8, 5, 4, 2, 1, 3, 7, 6], [1, 3, 6, 9, 5, 8, 7, 4, 2], [5, 4, 9, 6, 7, 2, 1, 3, 8], [8, 7, 2, 1, 3, 4, 6, 9, 5], [3, 6, 1, 5, 4, 9, 8, 2, 7], [2, 9, 4, 8, 6, 7, 5, 1, 3], [7, 5, 8, 2, 1, 3, 4, 6, 9]], "hitsGrid": [[null, null, 7, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, 3, null, 6], [null, null, null, null, null, null, 7, null, null], [null, 4, null, null, null, null, null, 3, 8], [null, 7, null, null, null, 4, null, 9, null], [null, null, null, null, null, null, 8, null, null], [null, null, null, null, null, null, null, 1, null], [null, null, 8, null, null, null, null, null, null]], "workingGrid": [[null, null, 7, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, 3, null, 6], [null, null, null, null, null, null, 7, null, null], [null, 4, null, null, null, null, null, 3, 8], [null, 7, null, null, null, 4, null, 9, null], [null, null, null, null, null, null, 8, null, null], [null, null, null, null, null, null, null, 1, null], [null, null, 8, null, null, null, null, null, null]], "guessedGrids": [[[5, 6, 7, 1, 9, 3, 4, 8, 2], [4, 3, 9, 2, 5, 8, 6, 7, 1], [8, 1, 2, 6, 4, 7, 3, 9, 5], [9, 8, 3, 5, 1, 2, 7, 6, 4], [2, 4, 1, 7, 6, 9, 5, 3, 8], [6, 7, 5, 3, 8, 4, 1, 2, 9], [7, 5, 6, 9, 2, 1, 8, 4, 3], [3, 2, 8, 4, 7, 5, 9, 1, 6], [1, 9, 4, 8, 3, 6, 2, 5, 7]], [[3, 6, 7, 5, 1, 2, 4, 8, 9], [5, 8, 9, 6, 4, 3, 1, 2, 7], [1, 2, 4, 9, 7, 8, 3, 5, 6], [8, 5, 1, 2, 3, 9, 7, 6, 4], [9, 4, 2, 7, 6, 1, 5, 3, 8], [6, 7, 3, 8, 5, 4, 2, 9, 1], [2, 1, 6, 3, 9, 7, 8, 4, 5], [7, 3, 5, 4, 8, 6, 9, 1, 2], [4, 9, 8, 1, 2, 5, 6, 7, 3]]], "checkedGrids": [[["M", "M", "H", "M", "C", "C", "M", "C", "M"], ["C", "C", "M", "M", "C", "M", "M", "C", "C"], ["C", "C", "M", "M", "C", "M", "H", "M", "M"], ["M", "M", "C", "C", "M", "C", "H", "M", "C"], ["M", "H", "M", "C", "C", "M", "M", "H", "H"], ["M", "H", "M", "C", "M", "H", "C", "M", "C"], ["C", "C", "C", "C", "M", "M", "H", "M", "C"], ["C", "C", "C", "M", "C", "M", "M", "H", "M"], ["M", "C", "C", "C", "C", "M", "M", "M", "C"]], [["M", "M", "H", "M", "M", "M", "M", "C", "C"], ["M", "C", "M", "M", "M", "M", "M", "C", "M"], ["M", "C", "M", "M", "M", "M", "H", "C", "H"], ["C", "M", "C", "M", "C", "C", "H", "M", "C"], ["C", "H", "C", "C", "C", "M", "M", "H", "H"], ["M", "H", "M", "M", "C", "H", "M", "H", "M"], ["C", "C", "C", "M", "C", "C", "H", "M", "M"], ["C", "M", "M", "M", "C", "C", "M", "H", "M"], ["M", "C", "H", "C", "C", "M", "C", "M", "C"]]], "workingGridHistory": [], "hitCount": 13, "missCount": 76, "closeCount": 63 }
    }

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
            //rawDraw(state);
            walkAndDraw(state);
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