
var screenHeight = 400;
var screenWidth = 400;


scanButtonElement = document.getElementById("scanButton");
scanButtonElement.onclick = scanClick;

nextButtonElement = document.getElementById("nextButton");
nextButtonElement.onclick = nextClick;

canvasElement = document.getElementById("Canvas");
canvasElement.width = screenWidth;
canvasElement.height = screenHeight;
canvasContext = canvasElement.getContext('2d');
canvasContext.font = '25px serif';
canvasElement.onclick = canvasClick;


qElement = document.getElementById("qDiv");
lElement = document.getElementById("lDiv");

qList = []
lList = []

lineCountElement = document.getElementById("lineCount");

pointOutputElement = document.getElementById("pointOutput");
pointOutputElement.innerHTML = "Points: <br>";

class Point{
    constructor(x, y, number){
        this.x = x;
        this.y = y;
        this.number = number;
        this.start = true;
    }
    setPartner(partner){
        this.partner = partner;
        this.setStart();
    }
    setStart(){
        this.start = this.x < this.partner.x ? true : false;
    }
    setLine(line){
        this.line = line;
    }
    printPoint(){
        console.log(`${this.start ? "P" : "Q"}${this.number}(${this.x}, ${this.y})`);
    }
    stringPoint(){
        return `${this.start ? "P" : "Q"}${this.number}(${this.x}, ${this.y})`;
    }
}

class Line{
    constructor(startPoint, endPoint){
        this.startPoint = startPoint.start ? startPoint : endPoint;
        this.endPoint = startPoint.start ? endPoint : startPoint;
        this.startPoint.setLine(this);
        this.endPoint.setLine(this);
        this.number = startPoint.number;
    }
    printLine(){
        console.log(this.startPoint.stringPoint() + " " + this.endPoint.stringPoint());
    }
    stringLine(){
        return `${this.number} ` + this.startPoint.stringPoint() + " " + this.endPoint.stringPoint();
    }

}

// variables

pointCount = 0
lineCount = 0
points = []
lines = []
intersections = []

function canvasClick(event){

    pointCount++;

    const rectangle = canvasElement.getBoundingClientRect();
    const point = new Point(
                        Math.floor(event.clientX - rectangle.left),
                        Math.floor(event.clientY - rectangle.top),
                        Math.floor(pointCount/2)
                        )    

    points.push(point)
    console.log(point)


    canvasContext.fillStyle = 'red'
    canvasContext.fillRect(point.x - 4, point.y - 4, 4, 4)

    if(pointCount % 2 == 0){
        updateLineCount();

        startPoint = points[pointCount-2];
        endPoint = points[pointCount-1];

        startPoint.setPartner(endPoint);
        endPoint.setPartner(startPoint);

        currentLine = new Line(
                                startPoint,
                                endPoint
                            )

        currentLine.printLine();

        lines.push(currentLine);

        redrawPoints();

    } else{
        canvasContext.fillText(`p${lineCount}`, point.x, point.y, 25, 25);

    }

    updatePointOutput();

}

function redrawPoints(){
    clearCanvas();
    clearPointOutput();
    lines.forEach(line => {

        
        canvasContext.fillStyle = 'red'
        canvasContext.fillText(`P${line.number}`, line.startPoint.x, line.startPoint.y, 25, 25);
        canvasContext.fillText(`Q${line.number}`, line.endPoint.x, line.endPoint.y, 25, 25);

        canvasContext.strokeStyle = 'blue'
        canvasContext.lineWidth = 1;
        canvasContext.setLineDash([]);
        canvasContext.beginPath();
        canvasContext.moveTo(line.startPoint.x, line.startPoint.y)
        canvasContext.lineTo(line.endPoint.x, line.endPoint.y)
        canvasContext.stroke()

    })
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

    nextButtonElement.style.visibility = "visible";

    generateQ();


}

function nextClick(){

}

function generateQ(){
    
    qList = points.sort(function(a, b){
        return a.x - b.x
    })
    qList.forEach(element => {
        element.printPoint();
    });
    qElement.innerHTML = qList
}

function clearCanvas(){
    canvasContext.fillStyle = 'white'
    canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
}
function clearPointOutput(){
    pointOutputElement.innerHTML = "";
}
function updatePointOutput(){
    clearPointOutput();

    // print points
    pointOutputElement.innerHTML += "Points: <br>"
    points.forEach( point =>{
        pointOutputElement.innerHTML += "\t" + point.stringPoint() + "<br>";
    })
    // print lines
    pointOutputElement.innerHTML += "Lines: <br>"
    lines.forEach( line =>{
        pointOutputElement.innerHTML += "\t" + line.stringLine() + "<br>";
    })

}