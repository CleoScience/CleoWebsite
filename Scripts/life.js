// todo:
// Track max and min populationCount
// track starting populationCount

var width = 500;
var height = 500;
var totalCells = width * height;
var generationCount = 0;
var populationCount = 0;
var peekPopulationCount = 0;
var peekPopulationGeneration = 0;

var generationNumberElement = document.getElementById("generationNumber");
var populationNumberElement = document.getElementById("populationNumber");
var peakPopulationElement = document.getElementById("PeakPopulation");

function updateNumberElements() {
    generationNumberElement.innerHTML = generationCount;
    populationNumberElement.innerHTML = populationCount;
    peakPopulationElement.innerHTML = String(peekPopulationCount) + "(Gen: " + String(peekPopulationGeneration) + ")";
}

canvasElement = document.getElementById("lifeCanvas");
canvasContext = canvasElement.getContext('2d');

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
plantRandomSeed(Math.floor((totalCells) / 5));

setInterval(generateAndDraw, 500);

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
            // check top left    y-1 x-1
            if (y > 0 && x > 0) {
                // do check
                if (grid[y - 1][x - 1] >= 1) {
                    neighbourCount++;
                }
            }
            // check top    y-1
            if (y > 0) {
                // do check
                if (grid[y - 1][x] >= 1) {
                    neighbourCount++;
                }
            }
            // check top right    y-1 x+1
            if (y > 0 && x < width - 1) {
                // do check
                if (grid[y - 1][x + 1] >= 1) {
                    neighbourCount++;
                }
            }
            // check left   x-1
            if (x > 0) {
                // do check
                if (grid[y][x - 1] >= 1) {
                    neighbourCount++;
                }
            }
            // check right  x+1
            if (x < width - 1) {
                // do check
                if (grid[y][x + 1] >= 1) {
                    neighbourCount++;
                }
            }
            // check bottom left y+1 x-1
            if (y < height - 1 && x > 0) {
                // do check
                if (grid[y + 1][x - 1] >= 1) {
                    neighbourCount++;
                }
            }
            // check bottom y+1
            if (y < height - 1) {
                // do check
                if (grid[y + 1][x] >= 1) {
                    neighbourCount++;
                }
            }
            // check bottom right y+1 x+1
            if (y < height - 1 && x < width - 1) {
                // do check
                if (grid[y + 1][x + 1] >= 1) {
                    neighbourCount++;
                }
            }
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
    grid = nextGeneration;
}

function drawGrid() {
    var cellWidth = 1;
    var cellHeight = 1;

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, width, height);

    canvasContext.fillStyle = 'black';
    for (var y = 0; y <= height - 1; y++) {
        for (var x = 0; x <= width - 1; x++) {
            if (grid[y][x] == 1) {
                canvasContext.fillStyle = 'black';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            } else if (grid[y][x] > 1000) {
                canvasContext.fillStyle = 'green';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            } else if (grid[y][x] > 100) {
                canvasContext.fillStyle = 'red';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            } else if (grid[y][x] > 1) {
                canvasContext.fillStyle = 'purple';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            } else {
                canvasContext.fillStyle = 'white';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            }
        }
    }


}

