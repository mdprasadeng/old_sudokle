
var HIT_COLOR = "rgba(144, 238, 144, 150)";
var MISS_COLOR = "rgba(255, 255, 255, 150)";
var CLOSE_COLOR = "rgba(211,211,211, 150)";

class Path {
    constructor(points, lineWidth, fillColor, scaleBy, offset, opacity) {
        this.points = points;
        this.lineWidth = lineWidth;
        this.fillColor = fillColor;
        this.scaleBy = scaleBy; // scales only points
        this.offset = offset; //not scaled
        this.opacity = opacity;
    }
}


class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function newPath({ points = [], lineWidth = 1, fillColor = null, scaleBy = 1, offset = new Point(0, 0) , opacity = 1 }) {
    return new Path(points, lineWidth, fillColor, scaleBy, offset, opacity)
}


function newPoint({ x = 0, y = 0 }) {
    return new Point(x, y);
}

function GetGuessPath(i) {
    switch (i){
        case 1: return GetGuessPath1();
        case 2: return GetGuessPath2();
        case 3: return GetGuessPath3();
        case 4: return GetGuessPath4();
        case 5: return GetGuessPath5();
        case 6: return GetGuessPath6();
        case 7: return GetGuessPath7();
        case 8: return GetGuessPath8();

    }
}


function GetGuessPath1() {
    return [
        new Point(0, 0),
        new Point(1, 0),
        new Point(0, 1)
    ];
}

function GetGuessPath2() {
    return [
        new Point(0, 0),
        new Point(-1, 0),
        new Point(0, 1)
    ];
}

function GetGuessPath3() {
    return [
        new Point(0, 0),
        new Point(1, 0),
        new Point(0, -1)
    ];
}

function GetGuessPath4() {
    return [
        new Point(0, 0),
        new Point(-1, 0),
        new Point(0, -1)
    ];
}

function GetGuessPath5() {
    return [
        new Point(1, 0),
        new Point(0.5, 0.5),
        new Point(1.5, 0.5)
    ];
}


function GetGuessPath6() {
    return [
        new Point(-0.5, 0.5),
        new Point(0, 1),
        new Point(-0.5, 1.5)
    ];
}

function GetGuessPath7() {
    return [
        new Point(0, -1),
        new Point(0.5, -0.5),
        new Point(0.5, -1.5)
    ];
}


function GetGuessPath8() {
    return [
        new Point(-1, 0),
        new Point(-0.5, -0.5),
        new Point(-1.5, -0.5)
    ];
}

function GetSquarePath() {
    return [
        new Point(0, 0),
        new Point(1, 0),
        new Point(1, 1),
        new Point(0, 1),
    ];
}

function GetRectPath(width, height) {
    return [
        new Point(0, 0),
        new Point(width, 0),
        new Point(width, height),
        new Point(0, height),
    ];
}

function DrawPath(ctx, path, dontstroke = false) {
    ctx.lineWidth = path.lineWidth;
    ctx.globalAlpha = path.opacity;
    ctx.translate(path.offset.x, path.offset.y);
    ctx.beginPath();

    for (let i = 0; i < path.points.length; i++) {
        var point = path.points[i];
        if (i == 0) {
            ctx.moveTo(point.x * path.scaleBy, point.y * path.scaleBy);
        } else {
            ctx.lineTo(point.x * path.scaleBy, point.y * path.scaleBy);
        }
    }
    ctx.closePath();
    if (!dontstroke) {
        ctx.stroke();
    }
    if (path.fillColor) {
        ctx.save();
        ctx.fillStyle = path.fillColor;
        ctx.fill();
        ctx.restore();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;

}

function DrawText(ctx, text, fontSize, at) {
    ctx.font = fontSize + "em Roboto"; 
    ctx.fillText(text, at.x, at.y);
}