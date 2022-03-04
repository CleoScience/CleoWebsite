
canvasElement = document.getElementById("Canvas");
canvasElement.width = 400;
canvasElement.height = 400;
canvasContext = canvasElement.getContext('2d');
canvasElement.onclick = canvasClick;

pointOutputElement = document.getElementById("pointOutput");
pointOutputElement.innerHTML = "Points: <br>";

// variables

pointCount = 0
points = []

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

    pointOutputElement.innerHTML += `      ( ${point[0]},${point[1]} ) <br>`

    if(pointCount % 2 == 0){
        startPoint = points[pointCount-2]
        endPoint = points[pointCount-1]
        canvasContext.strokeStyle = 'blue'
        canvasContext.beginPath();
        canvasContext.moveTo(startPoint[0], startPoint[1])
        canvasContext.lineTo(endPoint[0], endPoint[1])
        canvasContext.stroke()
        pointOutputElement.innerHTML += `    Line    <br>`

    }

}

