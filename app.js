var ctx;
var canvas;
var dim = {
    unit: 80,
    kr1: 30,
    kr2: 100
}

var sx = 0;
var sy = 0;
var answer = [];
var correct = [];
var current = [];
var guessed = [];
var correctGrid = [];
var guessCounter = 0;


class Guess {
    constructor(val, result) {
        this.val = val;
        this.result = result;
    }

    getFillColor() {
        switch (this.result) {
            case "hit": return "rgba(144, 238, 144, 150)";
            case "close": return "rgba(211,211,211, 150)";
            case "miss": return "rgba(255, 255, 255, 150)";
        }
    }
}

function init() {
    answer = grid();
    for (let i = 0; i < 9; i++) {
        correct[i] = [];
        current[i] = [];
        guessed[i] = [];
        if (i < 3) {
            correctGrid[i] = [];
        }
        for (let j = 0; j < 9; j++) {
            correct[i][j] = -1;
            current[i][j] = -1;
            guessed[i][j] = [];
            if (i < 3 && j < 3) {
                correctGrid[i][j] = [];
            }
        }
    }
}

init();

function onLoad() {
    canvas = document.getElementById('playarea');
    canvas.addEventListener("mousedown", onMouseDown);

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        draw();

    }
}

function toPoint(evt) {
    var rect = evt.target.getBoundingClientRect();
    var x = evt.clientX - rect.left; //x position within the element.
    var y = evt.clientY - rect.top;  //y position within the element.
    return newPoint({ x: x, y: y });
}

function onMouseMove(evt) {
    if (!downAt) return;
    currAt = toPoint(evt);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    drawNumpad(downAt.x, downAt.y);
}

function onMouseDown(evt) {
    downAt = toPoint(evt);
    sx = Math.floor(downAt.x / dim.unit);
    sy = Math.floor(downAt.y / dim.unit);
    draw();
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


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   

    //Draw9x9
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var correctCell = correct[i][j];
            var currentCell = current[i][j];

            var fillColor = correctCell > 0 ? "rgba(144, 238, 144, 150)" : null;

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
        offset: newPoint({ x: dim.unit * sx, y: dim.unit * sy }),
        opacity: 0.66,
        fillColor: "yellow"
    });
    DrawPath(ctx, path);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var correctCell = correct[i][j];
            var currentCell = current[i][j];

            if (correctCell > 0 || currentCell > 0) {
                DrawText(ctx, correctCell > 0 ? correctCell : currentCell, 40, newPoint({ x: dim.unit * i + dim.unit / 2, y: dim.unit * j + dim.unit / 2 }))
            }

        }
    }

    //Draw9x9 guesses
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var gx = Math.floor(i/3);
            var gy = Math.floor(j/3);
            var correctGuesses = correctGrid[gx][gy];
            
            for (var g = 1; g <= guessed[i][j].length; g++) {
                var guess = guessed[i][j][g-1];
                if (guess.result == "hit") continue;
                if (correctGuesses.indexOf(guess.val) >= 0) continue;    
                var path = newPath({
                    lineWidth: 1,
                    points: GetGuessPath(g),
                    offset: GetGuessOffset(g, i, j),
                    scaleBy: dim.unit / 2,
                    opacity: 1,
                    fillColor: guess.getFillColor()
                });
                DrawPath(ctx, path);
                DrawText(ctx, guess.val, 20, GetGuessTextAt(g, i, j))
            }

        }
    }

    

    

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

function onPressed(val) {
    val = Number(val);
    current[sx][sy] = val;
    
    if (sx%3 != 2) {
        sx += 1;
    } else {
        sx = Math.floor(sx/3) * 3;
        if (sy%3 != 2) {
            sy += 1;
        } else {
            sy = Math.floor(sy/3) * 3;
        } 
    }
    draw();
}

function onGuess() {
    var gx = Math.floor(sx / 3);
    var gy = Math.floor(sy / 3);
    var csx = Math.floor(sx / 3) * 3;
    var csy = Math.floor(sy / 3) * 3;
    
    if (guessed[csx][csy].length == 3)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (current[csx + i][csy + j] < 0) {
                return;
            }
        }
    }

    var allNotGreen = false;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            var val = current[csx + i][csy + j];
            current[csx + i][csy + j] = -1;
            var result = "miss";
            if (val == answer[csx + i][csy + j]) {
                result = "hit";
                correct[csx + i][csy + j] = val;
                current[csx + i][csy + j] = val;
                correctGrid[gx][gy].push(val);
            } else {
                var rowStartX = csx + i;
                var rowStartY = csy;
                var colStartX = csx;
                var colStartY = csy + j;
                // console.log([rowStartX, rowStartY, "x", colStartX, colStartY, " for ", csx+i, csy+j].join(""));
                for (let ti = 0; ti < 3; ti++) {
                    if (val == answer[rowStartX][rowStartY+ ti] || val == answer[colStartX + ti][colStartY]) {
                        result = "close";
                    }
                }
            }
            if (result != "miss") {
                allNotGreen = true;
            }
            guessed[csx + i][csy + j].push(new Guess(val, result))
        }
    }
    draw();

    guessCounter++;
    document.getElementById("gCounter").innerHTML = "Total Guesses : " + guessCounter;

    if (allNotGreen && guessed[csx][csy].length == 4) {
        alert("GameOver");
    }

}

function onClear() {
    var csx = Math.floor(sx / 3) * 3;
    var csy = Math.floor(sy / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (correct[csx + i][csy + j] < 0) {
                current[csx + i][csy +j] = -1;
            }
        }
    }

    draw();
}

function onRandom() {
    var csx = Math.floor(sx / 3) * 3;
    var csy = Math.floor(sy / 3) * 3;

    var options = [1,2,3,4,5,6,7,8,9];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (current[csx + i][csy + j] > 0) {
                let index = options.indexOf(current[csx + i][csy + j]);
                options.splice(index, 1);
            } 
        }
    }

    var randNumbers = shuffleArray(options);
    var index = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (current[csx + i][csy + j] < 0) {
                current[csx + i][csy + j] = randNumbers[index];
                index++;
            } 
        }
    }

    draw();

}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {

        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function reveal() {
    correct = answer;
    draw();
}