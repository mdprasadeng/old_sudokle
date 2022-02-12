
var ALL_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const HIT = "H";
const MISS = "M";
const CLOSE = "C";


class GridXY {
    constructor(startX = 0, endX = 8, startY = 0, endY = 8) {
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
    }
}

function get3x3GridXY(x, y) {
    var startX = Math.floor(x / 3) * 3;
    var startY = Math.floor(y / 3) * 3;
    return new GridXY(startX, startX + 2, startY, startY + 2);
}


function newGrid(prefilled, defval) {
    var grid = [];
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            if (prefilled && prefilled[i] && prefilled[i][j] && prefilled[i][j] > -1) {
                grid[i][j] = prefilled[i][j];
            } else {
                grid[i][j] = !!defval ? defval() : undefined;
            }
        }
    }
    return grid;
}

function fillGrid(filledGrid = null, gridXY = new GridXY(0, 8, 0, 8)) {
    var startX = gridXY.startX;
    var startY = gridXY.startY;
    var endX = gridXY.endX;
    var endY = gridXY.endY;

    var guessGrid = newGrid(filledGrid);

    var blackListed = [];
    var fillHistory = [];

    for (let i = 0; i < 9; i++) {
        blackListed[i] = [];
        for (let j = 0; j < 9; j++) {
            blackListed[i][j] = [];
        }
    }

    var findOptions = function (x, y) {
        var options = {};
        ALL_ARRAY.forEach(e => {
            options[e] = 1;
        })


        for (let i = 0; i < 9; i++) {
            if (guessGrid[x][i] > 0) {
                options[guessGrid[x][i]] = 0;
            }
            if (guessGrid[i][y] > 0) {
                options[guessGrid[i][y]] = 0;
            }
        }

        var cx = x - x % 3;
        var cy = y - y % 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (guessGrid[cx + i][cy + j] > 0) {
                    options[guessGrid[cx + i][cy + j]] = 0;
                }
            }
        }
        blackListed[x][y].forEach(e => {
            options[e] = 0;
        })

        var values = [];
        ALL_ARRAY.forEach(e => {
            if (options[e] == 1) {
                values.push(e);
            }
        });
        return values;
    }

    var x = startX, y = startY;
    while (1) {
        if (!guessGrid[x][y]) {
            var options = findOptions(x, y);


            if (options.length == 0) {
                if (fillHistory.length == 0) {
                    options = ALL_ARRAY;
                }
                else {
                    blackListed[x][y] = [];
                    var lastEntry = fillHistory.pop();
                    x = lastEntry.x;
                    y = lastEntry.y;
                    blackListed[x][y].push(guessGrid[x][y]);
                    guessGrid[x][y] = undefined;
                    continue;
                }
            }
            var option = options[Math.floor(Math.random() * options.length)];
            guessGrid[x][y] = option;
            fillHistory.push({ x: x, y: y });
        }
        if (x == endX) {
            if (y == endY) {
                return guessGrid;
                break;
            } else {
                y++;
                x = startX;
                continue;
            }
        } else {
            x++;
        }
    }
}

function clearGrid(grid, gridSize, clearWithGrid) {
    for (let i = gridSize.startX; i <= gridSize.endX; i++) {
        for (let j = gridSize.startY; j <= gridSize.endY; j++) {
            grid[i][j] = undefined;
            if (clearWithGrid && clearWithGrid[i] && clearWithGrid[i][j]) {
                grid[i][j] = clearWithGrid[i][j];
            }
        }
    }
}

function logGrid(grid) {
    for (let i = 0; i < 9; i++) {
        var line = []
        for (let j = 0; j < 9; j++) {

            line.push(grid[j][i] || "X");
        }
        console.log("|" + line.join("|") + "|")
    }
    console.log("*****************************************");
}

function checkGrid(guessGrid, answerGrid, gridSize = new GridXY(0, 8, 0, 8)) {
    var checkedGrid = newGrid();
    for (let i = gridSize.startX; i <= gridSize.endX; i++) {
        for (let j = gridSize.startY; j <= gridSize.endY; j++) {
            if (!guessGrid[i][j]) continue;
            var check = MISS;
            if (guessGrid[i][j] == answerGrid[i][j]) {
                check = HIT;
            } else {
                var subGridXY = get3x3GridXY(i, j);
                var rows = [answerGrid[subGridXY.startX][j], answerGrid[subGridXY.startX + 1][j], answerGrid[subGridXY.startX + 2][j]];
                var cols = [answerGrid[i][subGridXY.startY], answerGrid[i][subGridXY.startY + 1], answerGrid[i][subGridXY.startY + 2]];
                if (rows.indexOf(guessGrid[i][j]) >= 0 || cols.indexOf(guessGrid[i][j]) >= 0) {
                    check = CLOSE;
                }
            }
            checkedGrid[i][j] = check;
        }
    }
    return checkedGrid;
}

