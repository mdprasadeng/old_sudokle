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

    dim.titletxt = 45;
    dim.text = 25
    dim.guessTxtSize = 18;
}

var colors = {
    hit: "#6aaa64",
    miss: "#787c7e",
    close: "#c9b458",
    selectStroke: "#000000",
    selectFill: "#CCCCCC85",
    unitStroke: "#000000",
    unitAltStroke: "#000000",
    unit: "#FFFFFF",
    unitAlt: "#AAAAAA",
    btn: "#d3d6da",
    btndisabled: "#787c7e",
    debug: "#AA0000",
    white: "#FFFFFF",
    black: "#000000",
    title: "#4D4D4D"
}
var ctx;
var canvas;

class State {
    constructor() {
        this.puzzleNo = Math.floor((Date.now() - 1644765648114) / 86400000) + 1;
        this.sx = 0;
        this.sy = 0;
        this.answerGrid = fillGrid();
        this.hitsGrid = newGrid(); //has all values which are HITs filled
        this.workingGrid = newGrid(); //has working values
        this.guessesGrid = newGrid(undefined, () => new Map());
        this.workingGridHistory = [];
        this.hitCount = 0;
        this.missCount = 0;
        this.closeCount = 0;

    }
}

var actions = [];




function walkAndDraw(state, gifcopy, registerActions) {

    var registerAction = function (x, y, width, height, args, func) {
        if (registerActions) {
            actions.push({
                x: x,
                y: y,
                width: width,
                height: height,
                args: args,
                func: func
            });
        }
    }
    if (registerActions) {
        actions = [];
    }
    var textDrawCalls = []

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    var offx = dim.gap;
    var offy = dim.gap;
    var x = offx;
    var y = offy;
    var lx = x;
    var ly = y;
    var w;
    var h;
    var t;
    // header
    {

        //Sudokle 
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'center';
        ctx.drawText("Sudokle", new Pnt(x + dim.box + dim.gap + dim.unit * 0.75, y + dim.titletxt), dim.titletxt - 5, colors.title);

        ctx.drawText("#" + state.puzzleNo, new Pnt(x + dim.box + dim.unit * 2.8 + dim.gap * 1.5, y + dim.titletxt), dim.titletxt - 15, colors.title);


        //yellow and gray count
        lx = offx + dim.box * 2 + dim.gap * 2 + dim.unit * 0.85;
        ly = y, w = dim.unit * 1.5, h = dim.titletxt;
        {
            let points = [];
            let wedge = dim.unit / 2;

            points.push(new Pnt(lx, ly));
            points.push(new Pnt(lx + wedge, ly));
            points.push(new Pnt(lx, ly + wedge));
            ctx.walkPath(points);
            ctx.fillWStyle(colors.close);
        }
        {
            let points = [];
            let wedge = dim.unit / 2;

            points.push(new Pnt(lx + w, ly));
            points.push(new Pnt(lx + w - wedge, ly));
            points.push(new Pnt(lx + w, ly + wedge));
            ctx.walkPath(points);
            ctx.fillWStyle(colors.miss);
        }
        let old = ctx.lineWidth;
        ctx.lineWidth = 1;
        ctx.walkRect(new Pnt(lx, ly), new Pnt(w, h), 5);
        ctx.strokeWStyle(colors.black);
        ctx.drawText("" + (state.missCount + state.closeCount), new Pnt(lx + w / 2, y + dim.titletxt - dim.gap), dim.text + 5, colors.black);
        ctx.lineWidth = old;

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
    }
    x = offx;
    y = offy + dim.titletxt + dim.gap * 2;

    let selectCellPoints;

    {

        let selectPoints = [];

        let ui = state.sx % 3;
        let uj = state.sy % 3;
        let bi = (state.sx - ui) / 3;
        let bj = (state.sy - uj) / 3;

        lx = x + bi * dim.box + ui * dim.unit + (bi > 0 ? (bi) * dim.gap : 0);
        ly = y + bj * dim.box + uj * dim.unit + (bj > 0 ? (bj) * dim.gap : 0);
        w = dim.unit;
        h = dim.unit;

        selectCellPoints = [
            new Pnt(lx, ly),
            new Pnt(lx + w, ly),
            new Pnt(lx + w, ly + h),
            new Pnt(lx, ly + h)
        ];

        var start = new Pnt(
            x + bi * dim.box + (bi > 0 ? bi * dim.gap : 0),
            y + bj * dim.box + (bj > 0 ? bj * dim.gap : 0));

        selectPoints.push(new Pnt(start.x, start.y));

        selectPoints.push(new Pnt(start.x, start.y + uj * dim.unit));
        selectPoints.push(new Pnt(x, start.y + uj * dim.unit));
        selectPoints.push(new Pnt(x, start.y + (uj + 1) * dim.unit));
        selectPoints.push(new Pnt(start.x, start.y + (uj + 1) * dim.unit));

        selectPoints.push(new Pnt(start.x, start.y + dim.box));

        selectPoints.push(new Pnt(start.x + ui * dim.unit, start.y + dim.box));
        selectPoints.push(new Pnt(start.x + ui * dim.unit, y + 3 * dim.box + 2 * dim.gap));
        selectPoints.push(new Pnt(start.x + (ui + 1) * dim.unit, y + 3 * dim.box + 2 * dim.gap));
        selectPoints.push(new Pnt(start.x + (ui + 1) * dim.unit, start.y + dim.box));

        selectPoints.push(new Pnt(start.x + dim.box, start.y + dim.box));

        selectPoints.push(new Pnt(start.x + dim.box, start.y + (uj + 1) * dim.unit));
        selectPoints.push(new Pnt(x + 3 * dim.box + 2 * dim.gap, start.y + (uj + 1) * dim.unit));
        selectPoints.push(new Pnt(x + 3 * dim.box + 2 * dim.gap, start.y + (uj) * dim.unit));
        selectPoints.push(new Pnt(start.x + dim.box, start.y + (uj) * dim.unit));


        selectPoints.push(new Pnt(start.x + dim.box, start.y));

        selectPoints.push(new Pnt(start.x + (ui + 1) * dim.unit, start.y));
        selectPoints.push(new Pnt(start.x + (ui + 1) * dim.unit, y));
        selectPoints.push(new Pnt(start.x + (ui) * dim.unit, y));
        selectPoints.push(new Pnt(start.x + (ui) * dim.unit, start.y));


    }

    {
        for (let bi = 0; bi < 3; bi++) {
            for (let bj = 0; bj < 3; bj++) {

                for (let ui = 0; ui < 3; ui++) {
                    for (let uj = 0; uj < 3; uj++) {
                        let gx = bi * 3 + ui;
                        let gy = bj * 3 + uj;
                        let hit = state.hitsGrid[gx][gy];
                        let txt = state.workingGrid[gx][gy];
                        let guesses = state.guessesGrid[gx][gy];

                        let entered = [];
                
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                let entry = state.workingGrid[bi * 3 + i][bj * 3 + j];
                                if (!!entry) entered.push(entry);
                            }
                        }

                        lx = x + bi * dim.box + ui * dim.unit + (bi > 0 ? (bi) * dim.gap : 0);
                        ly = y + bj * dim.box + uj * dim.unit + (bj > 0 ? (bj) * dim.gap : 0);
                        w = dim.unit, h = dim.unit;

                        if (!!hit) {
                            ctx.walkRect(new Pnt(lx, ly), new Pnt(w, h));
                            ctx.fillWStyle(colors.hit);
                        }



                        if (!!txt) {
                            textDrawCalls.push([
                                "" + txt, new Pnt(lx + w / 2, ly + h / 2), dim.text, !!hit ? colors.white : colors.black
                            ]);
                        }

                        let guessPlace = 1;
                        let wedge = dim.unit / 2;
                        // if (bi==1 && bj==1 && ui==1 && uj==1) {
                        //     guesses = new Map();
                        //     guesses.set(1, MISS);
                        //     guesses.set(2, HIT);
                        //     guesses.set(3, HIT);
                        //     guesses.set(4, MISS);
                        //     guesses.set(6, MISS);
                        //     guesses.set(7, HIT);
                        //     guesses.set(8, HIT);
                        //     guesses.set(9, MISS);
                        // }

                        if (!!guesses) {
                            guesses.forEach(function (value, key) {
                                let points = [];
                                let textAt;
                                let textSize = dim.guessTxtSize;
                                switch (guessPlace) {
                                    case 1:
                                        points.push(new Pnt(lx, ly));
                                        points.push(new Pnt(lx + wedge, ly));
                                        points.push(new Pnt(lx, ly + wedge));
                                        textAt = new Pnt(lx + wedge / 3 - 1, ly + wedge / 3 - 1);
                                        break;
                                    case 2:
                                        points.push(new Pnt(lx + dim.unit, ly));
                                        points.push(new Pnt(lx + dim.unit - wedge, ly));
                                        points.push(new Pnt(lx + dim.unit, ly + wedge));
                                        textAt = new Pnt(lx + dim.unit - wedge / 3 + 1, ly + wedge / 3 - 1);
                                        break;
                                    case 3:
                                        points.push(new Pnt(lx + dim.unit, ly + dim.unit));
                                        points.push(new Pnt(lx + dim.unit - wedge, ly + dim.unit));
                                        points.push(new Pnt(lx + dim.unit, ly + dim.unit - wedge));
                                        textAt = new Pnt(lx + dim.unit - wedge / 3 + 1, ly + dim.unit - wedge / 3 + 1);
                                        break
                                    case 4:
                                        points.push(new Pnt(lx, ly + dim.unit));
                                        points.push(new Pnt(lx + wedge, ly + dim.unit));
                                        points.push(new Pnt(lx, ly + dim.unit - wedge));
                                        textAt = new Pnt(lx + wedge / 3 - 1, ly + dim.unit - wedge / 3 + 1);
                                        break
                                    case 5:
                                        textSize = dim.guessTxtSize - 5;
                                        points.push(new Pnt(lx + wedge / 2, ly + wedge / 2));
                                        points.push(new Pnt(lx + wedge, ly));
                                        points.push(new Pnt(lx + wedge + wedge / 2, ly + wedge / 2));
                                        textAt = new Pnt(lx + wedge, ly + wedge / 3);
                                        break
                                    case 6:
                                        textSize = dim.guessTxtSize - 5;
                                        points.push(new Pnt(lx + wedge + wedge / 2, ly + wedge / 2));
                                        points.push(new Pnt(lx + dim.unit, ly + wedge));
                                        points.push(new Pnt(lx + wedge + wedge / 2, ly + wedge + wedge / 2));
                                        textAt = new Pnt(lx + dim.unit - wedge / 3, ly + wedge)
                                        break
                                    case 7:
                                        textSize = dim.guessTxtSize - 5;
                                        points.push(new Pnt(lx + wedge + wedge / 2, ly + wedge + wedge / 2));
                                        points.push(new Pnt(lx + wedge, ly + dim.unit));
                                        points.push(new Pnt(lx + wedge / 2, ly + wedge + wedge / 2));
                                        textAt = new Pnt(lx + wedge, ly + dim.unit - wedge / 3 + 2);
                                        break;
                                    case 8:
                                        textSize = dim.guessTxtSize - 5;
                                        points.push(new Pnt(lx + wedge / 2, ly + wedge + wedge / 2));
                                        points.push(new Pnt(lx, ly + wedge));
                                        points.push(new Pnt(lx + wedge / 2, ly + wedge / 2));
                                        textAt = new Pnt(lx + wedge / 3, ly + wedge);
                                        break
                                }
                                if (entered.indexOf(key) >=0) {
                                    ctx.globalAlpha = 0.3;
                                }
                                ctx.walkPath(points);
                                ctx.fillWStyle(value == MISS ? colors.miss : colors.close);
                                textDrawCalls.push([
                                    "" + key, textAt, textSize, colors.white
                                ]);

                                if (entered.indexOf(key) >=0) {
                                    ctx.globalAlpha = 1;
                                }
                                guessPlace++;
                            });
                        }

                    }
                }

                var stroke = colors.unitStroke;
                var fill = colors.unit;

                ctx.lineWidth = 0.75;

                lx = x + bi * dim.box + (bi > 0 ? (bi) * dim.gap : 0);
                ly = y + bj * dim.box + (bj > 0 ? (bj) * dim.gap : 0);
                w = dim.box, h = dim.box;
                ctx.walkRect(new Pnt(lx, ly), new Pnt(w, h));
                ctx.strokeWStyle(stroke);

                registerAction(lx, ly, w, h, [bi, bj], (p, a, b) => {
                    var ui = Math.floor(p.x / dim.unit);
                    var uj = Math.floor(p.y / dim.unit);
                    state.sx = a * 3 + ui;
                    state.sy = b * 3 + uj;
                });


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
        let entered = [];
        let ui = state.sx % 3;
        let uj = state.sy % 3;
        let bi = (state.sx - ui) / 3;
        let bj = (state.sy - uj) / 3;

        for (let i = 0; i < 9; i++) {
            let entry;
            entry = state.workingGrid[state.sx][i];
            if (!!entry) entered.push(entry);

            entry = state.workingGrid[i][state.sy];
            if (!!entry) entered.push(entry);
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let entry = state.workingGrid[bi * 3 + i][bj * 3 + j];
                if (!!entry) entered.push(entry);
            }
        }


        ly = y;
        for (let n = 1; n <= 9; n++) {
            let btnColor = entered.indexOf(n) >= 0 ? colors.btndisabled : colors.btn;
            lx = x;
            w = dim.btn, h = dim.btn;
            ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
            ctx.fillWStyle(btnColor);
            ctx.drawText("" + n, new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.black);
            x += dim.btn + dim.gap;

            registerAction(lx, ly, w, h, [n], (p, n) => {
                onPressed(n);
            });
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
        ctx.drawText("⟲", new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.black);
        x += dim.btn + dim.gap;
        registerAction(lx, ly, w, h, [], (p) => {
            onUndo();
        });

        lx = x;
        w = dim.btn, h = dim.btn;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("␡", new Pnt(lx + w / 2, ly + h / 2), dim.text * 2, colors.black);
        x += dim.btn + dim.gap;
        registerAction(lx, ly, w, h, [], (p) => {
            onClear1x1();
        });

        let text = (!!window.blob) ? 
            ( (navigator.canShare && navigator.canShare({files: [gifFile]})) ? 
                "Share GIF"
                : "Get GIF") 
            : (state.hitCount == 81) ? "Making GIF":"Enter"
        lx = x;
        w = dim.box, h = dim.btn;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText(text, new Pnt(lx + w / 2, ly + h / 2), dim.text + 5, colors.black);
        x += dim.box + dim.gap;
        registerAction(lx, ly, w, h, [], (p) => {
            if (!!window.blob) {
                if (navigator.canShare && navigator.canShare({files: [gifFile]})) {
                    navigator.share({
                        files: [gifFile],
                        title: 'Sudokle #' + state.puzzleNo,
                        text: 'Done in ' + (state.missCount + state.closeCount),
                      });
                    
                } else {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";

                    var url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = "Sudokle #" + state.puzzleNo + ".gif";
                    a.click();
                    window.URL.revokeObjectURL(url);
                }

            } else {
                onGuess();
            }
            return true;
        });


        lx = x;
        w = dim.btn, h = dim.btn;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("🎲", new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.black);
        x += dim.btn + dim.gap;
        registerAction(lx, ly, w, h, [], (p) => {
            onRandom3x3();
        });


        lx = x;
        w = dim.btn, h = dim.btn;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("🎲", new Pnt(lx + w / 2, ly + h / 2), dim.text + 20, colors.black);
        x += dim.btn + dim.gap;
        registerAction(lx, ly, w, h, [], (p) => {
            onRandom9x9();
        });

        //console.log("Height:" + (ly + h));
        //console.log("Width:" + (lx + w + dim.btn + dim.gap));


    }


    textDrawCalls.forEach(element => {
        ctx.drawText(...element);
    });

    if (!!gifcopy) {
        gifcopy();
    }

    if (false){
        x = offx;
        y = offy;
        //tutorial ?
        lx = x;
        ly = y;
        w = dim.unit * 0.6, h = dim.titletxt;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("?", new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.black);
        registerAction(lx, ly, w, h, [], (p) => {
            console.log("tutorial");
        });

        //settings ⚙
        lx = x + dim.unit * 0.8
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("⚙", new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.black);
        registerAction(lx, ly, w, h, [], (p) => {
            console.log("settings");
        });


        //streak 📊
        lx = x + dim.box * 3 - dim.unit * 0.4;
        ctx.walkRoundRect(new Pnt(lx, ly), new Pnt(w, h), 4);
        ctx.fillWStyle(colors.btn);
        ctx.drawText("📊", new Pnt(lx + w / 2, ly + h / 2), dim.text, colors.black);
        registerAction(lx, ly, w, h, [], (p) => {
            console.log("strek");
        });
    }

    if (state.hitCount != 81) {
        //ctx.walkPath(selectPoints);
        //ctx.fillWStyle(colors.selectFill);
        let old = ctx.lineWidth;
        ctx.lineWidth = 1;
        ctx.walkPath(selectCellPoints);
        ctx.strokeWStyle(colors.black);
        ctx.lineWidth = old;
    }

}



function check(state) {

    var checkedGrid = checkGrid(state.workingGrid, state.answerGrid);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!checkedGrid[i][j]) continue;
            var val = state.workingGrid[i][j];
            switch (checkedGrid[i][j]) {
                case HIT:
                    if (!state.hitsGrid[i][j]) {
                        state.hitsGrid[i][j] = state.answerGrid[i][j];
                        state.hitCount++;
                        var bi = Math.floor(i / 3) * 3;
                        var bj = Math.floor(j / 3) * 3;
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                state.guessesGrid[bi + i][bj + j].delete(val);
                            }
                        }
                    }
                    break;
                case MISS:
                    if (!state.guessesGrid[i][j].has(val)) {
                        state.guessesGrid[i][j].set(val, MISS);
                        state.missCount++;
                    }
                    break;
                case CLOSE:
                    if (!state.guessesGrid[i][j].has(val)) {
                        state.guessesGrid[i][j].set(val, CLOSE);
                        state.closeCount++;
                    }
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
        width: canvas.width,
        height: canvas.height - 2 * dim.btn - dim.gap,
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
            init();
            walkAndDraw(state, () => {
                var delay = 1000;
                gif.addFrame(ctx, { delay: delay, copy: true })
            }, true);
        });


    } else {
        alert("Sorry, HTML Canvas is needed");
    }

}

function toPoint(evt) {
    var rect = evt.target.getBoundingClientRect();
    var x = evt.clientX - rect.left; //x position within the element.
    var y = evt.clientY - rect.top;  //y position within the element.
    return new Pnt(x, y);
}


function onMouseDown(evt) {
    var at = toPoint(evt);
    actions.forEach(action => {
        if (at.x >= action.x && at.x <= (action.x + action.width)) {
            if (at.y >= action.y && at.y <= (action.y + action.height)) {
                var skipRedraw = action.func(new Pnt(at.x - action.x, at.y - action.y), ...action.args);
                if (!skipRedraw) {
                    walkAndDraw(state);
                }
            }
        }
    })
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
    walkAndDraw(state, () => {
        var delay = 500;
        if (state.hitCount == 81) {
            delay += 2000;
        }
        gif.addFrame(ctx, { delay: delay, copy: true })
    });

    if (state.hitCount == 81) {
        gif.on('finished', function (blob) {
            console.log("gif finished:" + blob)
            window.blob = blob;
            window.gifFile = new File([blob], "Sudokle #" + state.puzzleNo + ".gif", {"type": "image/gif"});
            //window.open(URL.createObjectURL(blob));
            walkAndDraw(state);
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
}

function randFillState(gridXY) {
    state.workingGridHistory.push(newGrid(state.workingGrid));
    state.workingGrid = fillGrid(state.workingGrid, gridXY);
}

function onPressed(value) {
    value = Number(value);
    state.workingGridHistory.push(newGrid(state.workingGrid));
    state.workingGrid[state.sx][state.sy] = value;
}

function onUndo() {
    if (state.workingGridHistory.length != 0) {
        state.workingGrid = state.workingGridHistory.pop();
    }
}

function onKeyDown(key) {
    switch (key.key) {
        case "ArrowDown":
            state.sy = (state.sy + 1) % 9
            walkAndDraw(state);
            break;
        case "ArrowUp":
            state.sy = (state.sy - 1 + 9) % 9
            walkAndDraw(state);
            break;
        case "ArrowLeft":
            state.sx = (state.sx - 1 + 9) % 9
            walkAndDraw(state);
            break;
        case "ArrowRight":
            state.sx = (state.sx + 1) % 9
            walkAndDraw(state);
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
            walkAndDraw(state);
            break;
        case "Enter":
            onGuess();
            break;
        case "Backspace":
            onClear1x1();
            walkAndDraw(state);
            break;
    }
}