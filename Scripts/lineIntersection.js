
var screenHeight = 400;
var screenWidth = 400;


scanButtonElement = document.getElementById("scanButton");
scanButtonElement.onclick = scanClick;

canvasElement = document.getElementById("Canvas");
canvasElement.width = screenWidth;
canvasElement.height = screenHeight;
canvasContext = canvasElement.getContext('2d');
canvasContext.font = '25px serif';
canvasElement.onclick = canvasClick;


qElement = document.getElementById("qDiv");
lElement = document.getElementById("lDiv");

lineCountElement = document.getElementById("lineCount");

pointOutputElement = document.getElementById("pointOutput");
pointOutputElement.innerHTML = "Points: <br>";

class Point{
    constructor(x, y, number){
        this.x = x;
        this.y = y;
        this.number = number;
    }
}

class Line{
    constructor(startPoint, endPoint, number){
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.number = number;
    }
}

// variables

pointCount = 0
lineCount = 0
points = []
intersections = []

function canvasClick(event){

    pointCount++;

    const rectangle = canvasElement.getBoundingClientRect();
    const point = [
                    Math.floor(event.clientX - rectangle.left), 
                    Math.floor(event.clientY - rectangle.top) 
                    ];

    points.push(point)
    console.log(point)


    canvasContext.fillStyle = 'red'
    canvasContext.fillRect(point[0] - 4, point[1] - 4, 4, 4)

    pointOutputElement.innerHTML += `( ${point[0]},${point[1]} ) <br>`

    if(pointCount % 2 == 0){
        canvasContext.fillText(`q${lineCount}`, point[0], point[1], 25, 25);
        updateLineCount();
        startPoint = points[pointCount-2]
        endPoint = points[pointCount-1]
        canvasContext.strokeStyle = 'blue'
        canvasContext.lineWidth = 1;
        canvasContext.setLineDash([]);
        canvasContext.beginPath();
        canvasContext.moveTo(startPoint[0], startPoint[1])
        canvasContext.lineTo(endPoint[0], endPoint[1])
        canvasContext.stroke()
        pointOutputElement.innerHTML += `    Line    <br>`

    } else{
        canvasContext.fillText(`p${lineCount}`, point[0], point[1], 25, 25);

    }

}

function updateLineCount(){
    lineCount++;
    lineCountElement.innerHTML = "Line Count = " + parseInt(lineCount)
}

var scanPosition = 0

function scanClick(){
    
    canvasContext.strokeStyle = 'green'
    canvasContext.lineWidth = 5;
    canvasContext.setLineDash([5, 5, 5, 5]);
    canvasContext.beginPath();
    canvasContext.moveTo(0, screenHeight);
    canvasContext.lineTo(0, 0);
    canvasContext.stroke();

}
