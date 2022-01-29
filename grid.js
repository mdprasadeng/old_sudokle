var ONE = 1;
var TWO = 2;
var THREE = 3;
var FOUR = 4;
var FIVE = 5;
var SIX = 6;
var SEVEN = 7;
var EIGHT = 8;
var NINE = 9;

var ALL = ONE | TWO | THREE | FOUR | FIVE | SIX | SEVEN | EIGHT | NINE;
var ALL_ARRAY = [ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE];

var blackListed = [];
var filled = [];
var fillHistory = [];
function grid() {
    for (let i = 0; i < 9; i++) {
        blackListed[i] = [];
        filled[i] = [];
        for (let j = 0; j < 9; j++) {
            blackListed[i][j] = [];
            filled[i][j] = -1;
        }
    }

    var x = 0, y = 0;
    while (1) {
        var options = GetOptions(x, y);

        if (options.length == 0) {
            if (fillHistory.length == 0) {
                console.warn("No history to go back");
                break;
            }
            blackListed[x][y] = [];
            var lastEntry = fillHistory.pop();
            x = lastEntry.x;
            y = lastEntry.y;
            blackListed[x][y].push(filled[x][y]);
            filled[x][y] = -1;
            continue;
        }
        var option = options[Math.floor(Math.random() * options.length)];
        filled[x][y] = option;
        fillHistory.push({x: x, y:y});
        if (x == 8) {
            if (y == 8) {
                console.log("Sudoku done");
                break;
            } else {
                y++;
                x = 0;
                continue;
            }
        } else {
            x++;
        } 
    }

    return filled;
}

function GetOptions(x, y) {
    var options = {};
    ALL_ARRAY.forEach(e => {
        options[e] = 1;
    })


    for (let i = 0; i < 9; i++) {
        if (filled[x][i] > 0) {
            options[filled[x][i]] = 0;
        }
        if (filled[i][y] > 0) {
            options[filled[i][y]] = 0;
        }
    }

    var cx = x - x % 3;
    var cy = y - y % 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (filled[cx+i][cy+j] > 0) {
                options[filled[cx+i][cy+j]] = 0;
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

