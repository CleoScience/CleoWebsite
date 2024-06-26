// todo:
// Track max and min populationCount
// track starting populationCount

canvasElement = document.getElementById("lifeCanvas");
canvasContext = canvasElement.getContext('2d');

var width = canvasElement.width;
var height = canvasElement.height;
var totalCells = width * height;
var generationCount = 0;
var populationCount = 0;
var peekPopulationCount = 0;
var peekPopulationGeneration = 0;
var intervalLength = 100; // ms
var populationRecord = [];
var populationAverage = 0;
var oldestCell = 0;
var oldestCellXY = "";
var boostInterval = 500;
var boostEventList = [];

var generationNumberElement = document.getElementById("generationNumber");
var boostEventListElement = document.getElementById("boostEventList");
var populationNumberElement = document.getElementById("populationNumber");
var peakPopulationElement = document.getElementById("PeakPopulation");
var oldestCellElement = document.getElementById("oldestCell");
var averagePopulationElement = document.getElementById("AveragePopulation");

function updateNumberElements() {
    generationNumberElement.innerHTML = generationCount;
    populationNumberElement.innerHTML = populationCount;
    peakPopulationElement.innerHTML = String(peekPopulationCount) + "(Gen: " + String(peekPopulationGeneration) + ")";
    averagePopulationElement.innerHTML = String(populationAverage);
    oldestCellElement.innerHTML = String(oldestCell) + " - " + oldestCellXY;
    boostEventListElement.innerHTML = boostEventList;
}


// set up grid
var grid = Array(height);
for (var i = 0; i < grid.length; i++) {
    grid[i] = Array(width);
}

for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[y].length; x++) {
        grid[y][x] = 0;
    }
}

seed = [[25, 25], [25, 23], [24, 24], [26, 24], [0, 0], [1, 0], [0, 1], [40, 7], [40, 6], [40, 5], [40, 3], [39, 7], [39, 6], [39, 5]];

// plantSeed();
plantRandomSeed(Math.floor((totalCells) / 10));

setInterval(generateAndDraw, intervalLength);

function generateAndDraw() {
    console.log("Generations: ", generationCount++);
    createNextGeneration();
    drawGrid();
    updateNumberElements();
}
/**
 * Sets predetermained cells to living
 */
function plantSeed() {
    seed.forEach(element => {
        grid[element[0]][element[1]] = 1;
    });
}
/**
 * Sets Random cells to living
 * @param {*} seedCount Amount of cells to set to living
 */
function plantRandomSeed(seedCount) {
    console.log(seedCount, " seeds will be planted");
    for (var i = 0; i < seedCount; i++) {
        grid[Math.floor(Math.random() * (height - 1))][Math.floor(Math.random() * (width - 1))] = 1;
    }
}
function lookUp(y) {
    var up = y - 1;
    if (up < 0) {
        return height - 1;
    } else {
        return up;
    }
}
function lookDown(y) {
    var down = y + 1;
    if (down >= height) {
        return 0;
    } else {
        return down;
    }
}
function lookLeft(x) {
    var left = x - 1;
    if (left < 0) {
        return width - 1;
    } else {
        return left;
    }
}
function lookRight(x) {
    var right = x + 1;
    if (right >= width) {
        return 0;
    } else {
        return right;
    }
}
function checkTopLeft(x, y) {
    return grid[lookUp(y)][lookLeft(x)] >= 1;
}
function checkTopCenter(x, y) {
    return grid[lookUp(y)][x] >= 1;
}
function checkTopRight(x, y) {
    return grid[lookUp(y)][lookRight(x)] >= 1;
}
function checkLeft(x, y) {
    return grid[y][lookLeft(x)] >= 1;
}
function checkRight(x, y) {
    return grid[y][lookRight(x)] >= 1;
}
function checkBottomLeft(x, y) {
    return grid[lookDown(y)][lookLeft(x)] >= 1;
}
function checkBottomCenter(x, y) {
    return grid[lookDown(y)][x] >= 1;
}
function checkBottomRight(x, y) {
    return grid[lookDown(y)][lookRight(x)] >= 1;
}
function boostSeedSquare(nextGeneration) {
    var randomOptions = 4;
    var randomBoost = Math.floor(Math.random() * randomOptions);
    var boostName = "";
    var quarterHeight = Math.floor(height / 4);
    var quarterWidth = Math.floor(width / 4);
    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            if (randomBoost == 0) {
                if (x == 0 || y == 0 || x == width - 1 || y == height - 1) {
                    // Turns the wall cells alive
                    nextGeneration[y][x] = 1;
                }
                boostName = "Border";
            }
            if (randomBoost == 1) {
                if (x == quarterWidth || y == quarterHeight ||
                    x == width - quarterWidth || y == height - quarterHeight) {
                    // Turns inner grid alive
                    nextGeneration[y][x] = 1;
                }
                boostName = "Grid";
            }
            if (randomBoost == 2) {
                if (x == y || x == y - quarterHeight || x == y + quarterHeight) {
                    // Turns diagonal line alive
                    nextGeneration[y][x] = 1;
                }
                boostName = "Diagonal \\";
            }
            if (randomBoost == 3) {
                var inversX = width - x;
                if (inversX == y || inversX == y - quarterHeight || inversX == y + quarterHeight) {
                    // Turns diagonal line alive
                    nextGeneration[y][x] = 1;
                }
                boostName = "Diagonal /";
            }
        }
    }
    boostEventList.push(String(generationCount) + " - " + boostName + "<br/>");
    // boostEventList += (String(generationCount) + " - " + boostName + "<br>");
}
function createNextGeneration() {
    /**
     * Rules:
     * 1.   Any live cell with fewer than two live neighbors dies, as if by underpopulation.
     * 2.   Any live cell with two or three live neighbors lives on to the next generation.
     * 3.   Any live cell with more than three live neighbors dies, as if by overpopulation.
     * 4.   Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
     */
    populationCount = 0;
    var nextGeneration = Array(height);
    for (var i = 0; i < grid.length; i++) {
        nextGeneration[i] = Array(width);
    }
    var neighbourCount = 0;
    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            neighbourCount = 0;
            // check top left    
            if (checkTopLeft(x, y)) {
                neighbourCount++;
            }
            // check top    
            if (checkTopCenter(x, y)) {
                neighbourCount++;
            }
            // check top right
            if (checkTopRight(x, y)) {
                neighbourCount++;
            }
            // check left  
            if (checkLeft(x, y)) {
                neighbourCount++;
            }
            // check right  
            if (checkRight(x, y)) {
                neighbourCount++;
            }
            // check bottom left
            if (checkBottomLeft(x, y)) {
                neighbourCount++;
            }
            // check bottom 
            if (checkBottomCenter(x, y)) {
                neighbourCount++;
            }
            // check bottom right 
            if (checkBottomRight(x, y)) {
                neighbourCount++;
            }
            // Next generation check
            if (grid[y][x] >= 1) {
                // for living cells
                // rule 1.
                if (neighbourCount < 2) {
                    // dies from underpopulation
                    nextGeneration[y][x] = 0;
                }
                // rule 2.
                if (neighbourCount == 3 || neighbourCount == 2) {
                    // cell continues to live and makes it to the next generation
                    nextGeneration[y][x] = grid[y][x] + 1;
                    populationCount++;
                }
                // rule 3.
                if (neighbourCount > 3) {
                    // cell dies as if from over population
                    nextGeneration[y][x] = 0;
                }
            } else {
                // for dead cells
                // rule 4.
                if (neighbourCount == 3) {
                    // cell is reborn though reproduction
                    nextGeneration[y][x] = 1;
                    populationCount++;
                }

            }

        }
    }
    if (populationCount > peekPopulationCount) {
        peekPopulationCount = populationCount;
        peekPopulationGeneration = generationCount;
    }
    populationRecord.push(populationCount);
    var sum = populationRecord.reduce((a, b) => a + b, 0);
    populationAverage = sum / populationRecord.length;

    // 500 mod boost
    if (generationCount % boostInterval == 0) {
        boostSeedSquare(nextGeneration);
    }

    grid = nextGeneration;
}

function drawGrid() {
    var cellWidth = 1;
    var cellHeight = 1;

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, width, height);

    canvasContext.fillStyle = 'black';
    var fillStyleText = "";
    var pixelMax = 255;
    oldestCell = 0;
    oldestCellXY = "";
    for (var y = 0; y <= height - 1; y++) {
        for (var x = 0; x <= width - 1; x++) {
            if (grid[y][x] > oldestCell) {
                oldestCell = grid[y][x];
                oldestCellXY = "(" + String(x) + ", " + String(y) + ")";
            }
            if (grid[y][x] == 1) {
                fillStyleText = 'black';
            } else if (grid[y][x] > pixelMax * 2) {
                fillStyleText = 'rgba(' + String(pixelMax - (grid[y][x] * 30 % pixelMax)) + ', ' + String((grid[y][x] * 10 % pixelMax)) + ', ' + String(pixelMax - (grid[y][x] * 30 % pixelMax)) + ', 1)';
                // fillStyleText = 'rgba(' + String(255 - (grid[y][x] % 255)) + ', 255, 0, 1)';
            } else if (grid[y][x] > pixelMax) {
                fillStyleText = 'rgba(' + String(((grid[y][x] * 20) % pixelMax)) + ', ' + String(pixelMax - (grid[y][x] * 10 % pixelMax)) + ', ' + String(pixelMax - (grid[y][x] * 50 % pixelMax)) + ', 1)';
            } else if (grid[y][x] > 1) {
                fillStyleText = 'rgba(' + String((grid[y][x] * 10 % pixelMax)) + ', ' + String(pixelMax - (grid[y][x] * 10 % pixelMax)) + ', ' + String(pixelMax - (grid[y][x] % pixelMax)) + ', 1)';
            } else {
                fillStyleText = 'white';
            }
            canvasContext.fillStyle = fillStyleText;
            canvasContext.fillRect(x, y, cellWidth, cellHeight);
        }
    }


}

