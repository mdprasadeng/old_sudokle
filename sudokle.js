var state = {
    width: 360 * 2,
    height: 360 * 2,
    unitSize: 80
};

var cell = grid();
var sx = 0; sy = 0; si = 0; sj = 0;
var guess = [];
var currentGuess = [];
for (let i = 0; i < 9; i++) {
    guess[i] = [];
    currentGuess[i] = [];
    for (let j = 0; j < 9; j++) {
        guess[i][j] = [];
        currentGuess[i][j] = -1;
    }
}

function OnGuess() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (currentGuess[sx * 3 + i][sy * 3 + j] == -1) {
                return;
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (currentGuess[sx * 3 + i][sy * 3 + j] == cell[sx * 3 + i][sy * 3 + j]) {
                guess[sx*3 +i][sy*3+ j].push({ val: currentGuess[sx * 3 + i][sy * 3 + j], result: "hit" })
            } else {
                var close = false;
                for (let ti = 0; ti < 3; ti++) {
                    for (let tj = 0; tj < 3; tj++) {
                        if (currentGuess[sx * 3 + i][sy * 3 + j] == cell[sx * 3 + ti][sy * 3 + tj]) {
                            close = true;
                            guess[sx*3 +i][sy*3+ j].push({ val: currentGuess[sx * 3 + i][sy * 3 + j], resutl: "close" })
                        }
                    }
                }
                if (!close) {
                    guess[sx*3 +i][sy*3+ j].push({ val: currentGuess[sx * 3 + i][sy * 3 + j], resutl: "miss" })
                }
            }
        }
    }
    console.log(guess);
    reDraw();
}

function onLoad() {
    reDraw();
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
}

var isShiftDown = false;

function keyDown(key) {
    switch (key.key) {
        case "ArrowDown":
            if (isShiftDown) {
                sy++;
                sy = sy % 3;
                reDraw();
            } else {
                sj++;
                sj = sj % 3;
                reDraw();
            }
            break;
        case "ArrowUp":
            if (isShiftDown) {
                sy--;
                sy = Math.abs((3 + sy) % 3);
                reDraw();
            } else {
                sj--;
                sj = Math.abs((3 + sj) % 3);
                reDraw();
            }
            break;
        case "ArrowRight":
            if (isShiftDown) {
                sx++;
                sx = sx % 3;
                reDraw();
            } else {
                si++;
                si = si % 3;
                reDraw();
            }
            break;
        case "ArrowLeft":
            if (isShiftDown) {
                sx--;
                sx = Math.abs((3 + sx) % 3);
                reDraw();
            } else {
                si--;
                si = Math.abs((3 + si) % 3);
                reDraw();
            }
            break;
        case "Shift":
            isShiftDown = true;
            break;
        case "Enter":
            OnGuess();
            break;
        case "1":
            currentGuess[sx * 3 + si][sy * 3 + sj] = 1;
            reDraw();
            break;
        case "2":
            currentGuess[sx * 3 + si][sy * 3 + sj] = 2;
            reDraw();
            break;
        case "3":
            currentGuess[sx * 3 + si][sy * 3 + sj] = 3;
            reDraw();
            break;
        case "4":
            currentGuess[sx * 3 + si][sy * 3 + sj] = 4;
            reDraw();
            break;
        case "5":
            currentGuess[sx * 3 + si][sy * 3 + sj] = 5;
            reDraw();
            break;
        case "6":
            currentGuess[sx * 3 + si][sy * 3 + sj] = 6;
            reDraw();
            break;
        case "7":
            currentGuess[sx * 3 + si][sy * 3 + sj] = 7;
            reDraw();
            break;
        case "8":
            currentGuess[sx * 3 + si][sy * 3 + sj] = 8;
            reDraw();
            break;
        case "9":
            currentGuess[sx * 3 + si][sy * 3 + sj] = 9;
            reDraw();
            break;
    }
}

function keyUp(key) {
    if (key.key == "Shift") {
        isShiftDown = false;
    }
}

function reDraw() {
    var canvas = document.getElementById('playarea');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (sx == x && sy == y) {
                    ctx.globalAlpha = 1;
                    drawSudokuMiniGrid(x, y, ctx);
                } else {
                    ctx.globalAlpha = 0.2;
                    drawSudokuMiniGrid(x, y, ctx);
                }
            }
        }
    } else {
        console.log("no canvas")
    }
}

function drawSudokuMiniGrid(x, y, ctx) {
    var drawX = state.unitSize * x * 3;
    var drawY = state.unitSize * y * 3;

    for (let i = 0; i <= 3; i++) {
        if (i == 3 || i == 0) {
            ctx.lineWidth = 3;
        } else {
            ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.moveTo(drawX + state.unitSize * i, drawY + 0);
        ctx.lineTo(drawX + state.unitSize * i, drawY + state.height / 3);
        ctx.stroke();
    }
    for (let i = 0; i <= 3; i++) {
        if (i == 3 || i == 0) {
            ctx.lineWidth = 3;
        } else {
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo(drawX + 0, drawY + state.unitSize * i, 0);
        ctx.lineTo(drawX + state.width / 3, drawY + state.unitSize * i);
        ctx.stroke();
    }

    

    var fontSize = 30;
    ctx.font = fontSize + 'px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (si == i && sj == j && x == sx && y == sy) {

                ctx.fillStyle = 'lightyellow';
                ctx.fillRect(drawX + state.unitSize * i + 2, drawY + state.unitSize * j + 2, state.unitSize - 2, state.unitSize - 2);
                ctx.fillStyle = 'black';
            }
            ctx.fillText(currentGuess[x * 3 + i][y * 3 + j], drawX + state.unitSize / 2 + state.unitSize * i, drawY + state.unitSize / 2 + state.unitSize * j);

        }
    }

        var fontSize = 12;
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            var g = guess[x*3 + i][y*3 + j];
            if (g.length > 0) {
                if (g[0].result == "hit") {
                    ctx.fillStyle = 'green';
                } else if (g[0].result == "close")  {
                    ctx.fillStyle = 'yellow';
                } else {
                    ctx.fillStyle = 'black';
                }
                ctx.fillText(g[0].val, drawX + state.unitSize / 2 + state.unitSize * i - state.unitSize / 3, drawY + state.unitSize / 2 + state.unitSize * j - state.unitSize / 3);
            }
            if (g.length > 1) {
                if (g[1].result == "hit") {
                    ctx.fillStyle = 'green';
                } else if (g[1].result == "close")  {
                    ctx.fillStyle = 'yellow';
                } else {
                    ctx.fillStyle = 'black';
                }

                ctx.fillText(g[1].val, drawX + state.unitSize / 2 + state.unitSize * i + state.unitSize / 3, drawY + state.unitSize / 2 + state.unitSize * j - state.unitSize / 3);
            }
            if (g.length > 2) {
                if (g[2].result == "hit") {
                    ctx.fillStyle = 'green';
                } else if (g[2].result == "close")  {
                    ctx.fillStyle = 'yellow';
                } else {
                    ctx.fillStyle = 'black';
                }
                ctx.fillText(g[2].val, drawX + state.unitSize / 2 + state.unitSize * i - state.unitSize / 3, drawY + state.unitSize / 2 + state.unitSize * j + state.unitSize / 3);
            }
            if (g.length > 3) {
                if (g[3].result == "hit") {
                    ctx.fillStyle = 'green';
                } else if (g[3].result == "close")  {
                    ctx.fillStyle = 'yellow';
                } else {
                    ctx.fillStyle = 'black';
                }
                ctx.fillText(g[3].val, drawX + state.unitSize / 2 + state.unitSize * i + state.unitSize / 3, drawY + state.unitSize / 2 + state.unitSize * j + state.unitSize / 3);
            }
        }
    }


    // var diagWidth = 0.5;
    // ctx.lineWidth = diagWidth;
    // // top left 1
    // for (let i = 0; i < 3; i++) {
    //     ctx.beginPath();
    //     ctx.moveTo(drawX + 0, drawY + state.unitSize / 2 + state.unitSize * i);
    //     ctx.lineTo(drawX + state.unitSize / 2 + state.unitSize * i, drawY + 0);
    //     ctx.stroke();
    // }

    // // top left 2
    // for (let i = 0; i < 3; i++) {
    //     ctx.beginPath();
    //     ctx.moveTo(drawX + state.unitSize / 2 + state.unitSize * i, drawY + (state.height / 3));
    //     ctx.lineTo(drawX + (state.width / 3), drawY + state.unitSize / 2 + state.unitSize * i);
    //     ctx.stroke();
    // }

    // // top right 1
    // for (let i = 0; i < 3; i++) {
    //     ctx.beginPath();
    //     ctx.moveTo(drawX + state.unitSize / 2 + state.unitSize * i, drawY + 0);
    //     ctx.lineTo(drawX + (state.width / 3), drawY + state.unitSize / 2 + state.unitSize * (3 - 1 - i));
    //     ctx.stroke();
    // }

    // //top right 2
    // for (let i = 0; i < 3; i++) {
    //     ctx.beginPath();
    //     ctx.moveTo(drawX + 0, drawY + state.unitSize / 2 + state.unitSize * i);
    //     ctx.lineTo(drawX + state.unitSize / 2 + state.unitSize * (3 - 1 - i), drawY + (state.height / 3));
    //     ctx.stroke();
    // }

    // for (let i = 0; i < 3; i++) {
    //     for (let j = 0; j < 3; j++) {
    //         ctx.fillText(cell[i][j], state.unitSize / 2 + state.unitSize * i + state.unitSize / 3, state.unitSize / 2 + state.unitSize * j - state.unitSize / 3);
    //         ctx.fillText(cell[i][j], state.unitSize / 2 + state.unitSize * i + state.unitSize / 3, state.unitSize / 2 + state.unitSize * j + state.unitSize / 3);

    //     }
    // }

}

function drawSudoku(ctx) {
    for (let i = 0; i <= 9; i++) {
        if (i == 0 || i == 9) {
            ctx.lineWidth = 10;
        }
        else if (i == 3 || i == 6) {
            ctx.lineWidth = 3;
        } else {
            ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.moveTo(state.unitSize * i, 0);
        ctx.lineTo(state.unitSize * i, state.height);
        ctx.stroke();
    }
    for (let i = 0; i <= 9; i++) {
        if (i == 0 || i == 9) {
            ctx.lineWidth = 10;
        }
        else if (i == 3 || i == 6) {
            ctx.lineWidth = 3;
        } else {
            ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo(0, state.unitSize * i, 0);
        ctx.lineTo(state.width, state.unitSize * i);
        ctx.stroke();
    }

    var diagWidth = 0.5;
    ctx.lineWidth = diagWidth;
    // top left 1
    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.moveTo(0, state.unitSize / 2 + state.unitSize * i);
        ctx.lineTo(state.unitSize / 2 + state.unitSize * i, 0);
        ctx.stroke();
    }

    // top left 2
    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.moveTo(state.unitSize / 2 + state.unitSize * i, state.height);
        ctx.lineTo(state.width, state.unitSize / 2 + state.unitSize * i);
        ctx.stroke();
    }

    // top right 1
    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.moveTo(state.unitSize / 2 + state.unitSize * i, 0);
        ctx.lineTo(state.width, state.unitSize / 2 + state.unitSize * (9 - 1 - i));
        ctx.stroke();
    }

    //top right 2
    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.moveTo(0, state.unitSize / 2 + state.unitSize * i);
        ctx.lineTo(state.unitSize / 2 + state.unitSize * (9 - 1 - i), state.height);
        ctx.stroke();
    }

    var fontSize = 30;
    ctx.font = fontSize + 'px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            ctx.fillText(cell[i][j], state.unitSize / 2 + state.unitSize * i, state.unitSize / 2 + state.unitSize * j);
        }
    }

    var fontSize = 12;
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // ctx.fillText(cell[i][j], state.unitSize / 2 + state.unitSize * i - state.unitSize / 3, state.unitSize / 2 + state.unitSize * j - state.unitSize / 3);
            // ctx.fillText(cell[i][j], state.unitSize / 2 + state.unitSize * i - state.unitSize / 3, state.unitSize / 2 + state.unitSize * j + state.unitSize / 3);
            // ctx.fillText(cell[i][j], state.unitSize / 2 + state.unitSize * i + state.unitSize / 3, state.unitSize / 2 + state.unitSize * j - state.unitSize / 3);
            // ctx.fillText(cell[i][j], state.unitSize / 2 + state.unitSize * i + state.unitSize / 3, state.unitSize / 2 + state.unitSize * j + state.unitSize / 3);

        }
    }

}

