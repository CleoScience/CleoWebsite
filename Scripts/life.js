
var width = 50;
var height = 50;

canvasElement = document.getElementById("lifeCanvas");
canvasContext = canvasElement.getContext('2d');

var grid = Array(height);
for (var i = 0; i < grid.length; i++) {
    grid[i] = Array(width);
}

for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[y].length; x++) {
        grid[y][x] = 0;
    }
}

console.log(grid);

seed = [[25, 25], [25, 23], [24, 24], [26,24], [0, 0], [1, 10], [40, 7], [40,6], [40, 5], [40, 3], [39, 7], [39,6], [39, 5]];

plantSeed();

console.log(grid);

createNextGeneration();

console.log(grid);

setTimeout(generateAndDraw, 1000);

function generateAndDraw(){
    createNextGeneration();
    drawGrid();
}

function plantSeed() {
    seed.forEach(element => {
        grid[element[0]][element[1]] = 1;
    });
}

function createNextGeneration() {
    var nextGeneration = Array(height);
    for (var i = 0; i < grid.length; i++) {
        nextGeneration[i] = Array(width);
    }

    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            var neighbourCount = 0; 
            // check top left    y-1 x-1
            if(y > 0 && x > 0){
                // do check
                if(grid[y-1][x-1] == 1){
                    neighbourCount++;
                }
            }
            // check top    y-1
            if(y > 0){
                // do check
                if(grid[y-1][x] == 1){
                    neighbourCount++;
                }
            }
            // check top right    y-1 x+1
            if(y > 0 && x < width-1){
                // do check
                if(grid[y-1][x+1] == 1){
                    neighbourCount++;
                }
            }
            // check left   x-1
            if(x > 0){
                // do check
                if(grid[y][x-1] == 1){
                    neighbourCount++;
                }
            }
            // check right  x+1
            if(x < width-1){
                // do check
                if(grid[y][x+1] == 1){
                    neighbourCount++;
                }
            }
            // check bottom left y+1 x-1
            if(y < height-1 && x > 0){
                // do check
                if(grid[y+1][x-1] == 1){
                    neighbourCount++;
                }
            }
            // check bottom y+1
            if(y < height-1){
                // do check
                if(grid[y+1][x] == 1){
                    neighbourCount++;
                }
            }
            // check bottom right y+1 x+1
            if(y < height-1 && x < width-1){
                // do check
                if(grid[y+1][x-1] == 1){
                    neighbourCount++;
                }
            }
            if(neighbourCount <= 3 && neighbourCount >= 2 ){
                nextGeneration[y][x] = 1;
            } else{
                nextGeneration[y][x] = 0;
            }
        }
    }
    grid = nextGeneration;
}

function drawGrid() {
    var cellWidth = 10;
    var cellHeight = 10;

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, width, height);

    canvasContext.fillStyle = 'black';
    for (var i = 0; i <= height; i = i + cellHeight) {
        canvasContext.fillRect(0, i, width, 1);
    }
    for (var i = 0; i <= width; i = i + cellWidth) {
        canvasContext.fillRect(i, 0, 1, height);
    }


}

