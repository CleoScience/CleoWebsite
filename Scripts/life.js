
var width = 500;
var height = 500;

canvasElement = document.getElementById("lifeCanvas");
canvasContext = canvasElement.getContext('2d');

function drawGrid(){
    var cellWidth = 10;
    var cellHeight = 10;

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, width, height);

    canvasContext.fillStyle = 'black';
    for(var i = 0; i <= height; i = i + cellHeight){
        canvasContext.fillRect(0, i, width, 1);
    }
    for(var i = 0; i <= width; i = i + cellWidth){
        canvasContext.fillRect(i, 0, 1, height);
    }
    

}

drawGrid();
