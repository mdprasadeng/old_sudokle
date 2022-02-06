
var HIT_COLOR = "rgba(106, 170, 100, 1)";
var MISS_COLOR = "rgba(120, 124, 126, 1)";
var CLOSE_COLOR = "rgba(201, 180, 88, 1)";

class Path {
    constructor(points, lineWidth, fillColor, scaleBy, offset, opacity, strokeStyle) {
        this.points = points;
        this.lineWidth = lineWidth;
        this.fillColor = fillColor;
        this.scaleBy = scaleBy; // scales only points
        this.offset = offset; //not scaled
        this.opacity = opacity;
        this.strokeStyle = strokeStyle;
    }
}


class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function newPath({ points = [], lineWidth = 1, fillColor = null, scaleBy = 1, offset = new Point(0, 0) , opacity = 1, strokeStyle = "#AAAAAA" }) {
    return new Path(points, lineWidth, fillColor, scaleBy, offset, opacity, strokeStyle)
}


function newPoint({ x = 0, y = 0 }) {
    return new Point(x, y);
}

function GetGuessPath(i, unit, off) {
    switch (i){
        case 1: return GetGuessPath1(unit, off);
        case 2: return GetGuessPath2(unit, off);
        case 3: return GetGuessPath3(unit, off);
        case 4: return GetGuessPath4(unit, off);
        case 5: return GetGuessPath5(unit, off);
        case 6: return GetGuessPath6(unit, off);
        case 7: return GetGuessPath7(unit, off);
        case 8: return GetGuessPath8(unit, off);

    }
}


function GetGuessPath1(unit, off) {
    return [
        new Point(off, off),
        new Point(unit -off, off),
        new Point(off, unit -off)
    ];
}

function GetGuessPath2(unit, off) {
    return [
        new Point(-off, off),
        new Point(-unit + off, off),
        new Point(-off, unit -off)
    ];
}

function GetGuessPath3(unit, off) {
    return [
        new Point(off, -off),
        new Point(unit -off, -off),
        new Point(off, -unit +off)
    ];
}

function GetGuessPath4(unit, off) {
    return [
        new Point(-off, -off),
        new Point(-unit +off, -off),
        new Point(-off, -unit +off)
    ];
}

function GetGuessPath5(unit, off) {
    return [
        new Point(unit, off),
        new Point(0.5 * unit, 0.5 * unit),
        new Point(1.5 * unit, 0.5 * unit)
    ];
}


function GetGuessPath6(unit, off) {
    return [
        new Point(-0.5*unit, 0.5*unit),
        new Point(-off, unit),
        new Point(-0.5*unit, 1.5*unit)
    ];
}

function GetGuessPath7(unit, off) {
    return [
        new Point(off, -unit),
        new Point(0.5*unit, -0.5*unit),
        new Point(0.5*unit, -1.5*unit)
    ];
}


function GetGuessPath8(unit, off) {
    return [
        new Point(-unit, -off),
        new Point(-0.5*unit, -0.5*unit),
        new Point(-1.5*unit, -0.5*unit)
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

function DrawText(ctx, text, fontSize, at, fontColor) {
    ctx.save();
    ctx.fillStyle = fontColor;
    ctx.font = fontSize + "em Roboto"; 
    ctx.fillText(text, at.x, at.y);
    ctx.restore();
}