
var width = 900;
var height = 700;
var generationCount = 0;

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
plantRandomSeed(Math.floor((width*height)/10));

setInterval(generateAndDraw, 500);

function generateAndDraw() {
    console.log("Generations: ", generationCount++);
    createNextGeneration();
    drawGrid();
}

function plantSeed() {
    seed.forEach(element => {
        grid[element[0]][element[1]] = 1;
    });
}
function plantRandomSeed(seedCount){
    console.log(seedCount, " seeds will be planted");
    for(var i = 0; i < seedCount; i++){
        grid[Math.floor(Math.random()*(height-1))][Math.floor(Math.random()*(width-1))] = 1;
    }
}

function createNextGeneration() {
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

            if (grid[y][x] >= 1 && (neighbourCount == 3 || neighbourCount == 2)) {
                // for all live cells,
                // If it has 2 or 3 neighbors it continues living (ages)
                nextGeneration[y][x] = grid[y][x] + 1;
            } else if (grid[y][x] == 0 && neighbourCount == 3){
                // for all dead cells,
                // if it has exactly 3 neighbors it is repopulated (age 1)
                nextGeneration[y][x] = 1;
            } else {
                // All other cells die (age 0)
                nextGeneration[y][x] = 0;
            }
        }
    }
    grid = nextGeneration;
}

function drawGrid() {
    var cellWidth = 1;
    var cellHeight = 1;

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, width, height);

    canvasContext.fillStyle = 'black';
    for (var y = 0; y <= height-1; y++) {
        for (var x = 0; x <= width-1; x++) {
            if (grid[y][x] == 1) {
                canvasContext.fillStyle = 'black';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            }else if(grid[y][x] > 1000) {
                canvasContext.fillStyle = 'green';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            }else if(grid[y][x] > 100) {
                canvasContext.fillStyle = 'red';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            }else if(grid[y][x] > 1) {
                canvasContext.fillStyle = 'purple';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            }else{
                canvasContext.fillStyle = 'white';
                canvasContext.fillRect(x, y, cellWidth, cellHeight);
            }
        }
    }


}

