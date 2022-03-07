
canvasElement = document.getElementById("mandelbrotCanvas");
canvasElement.width = 400;
canvasElement.height = 400;
canvasContext = canvasElement.getContext('2d');
canvasElement.onclick = canvasClick;


zoomElement = document.getElementById("zoom")
centerElement = document.getElementById("center");
centerVirtualElement = document.getElementById("centerVirtual");
statsParagraphElement = document.getElementById("stats");
randomLayersElement = document.getElementById("randomLayers");
randomElement = document.getElementById("random");
doubleResolutionElement = document.getElementById("doubleResolution");
statusElement = document.getElementById("status");
resetRandomElement = document.getElementById("resetRandomLayers");
resetRandomElement.onclick = makeRandomLayers;

function canvasClick(event){
    const rectangle = canvasElement.getBoundingClientRect();
    const point = [
                    Math.floor(event.clientX - rectangle.left), 
                    Math.floor(event.clientY - rectangle.top) 
                    ];

    console.log(point)

    canvasContext.fillStyle = 'red'
    canvasContext.fillRect(point[0] - 4, point[1] - 4, 4, 4)

    setCenter(point)

}

// variables

screenSizeX = 400
screenSizeY = 400
modelLeft = -2.0
modelRight = 2.0
modelBottom = -2.0
modelTop = 2.0
centerX = 0.0
centerY = 0.0
centerVirtualX = 0.0
centerVirtualY = 0.0

randomLayers = []


buttonElement = document.getElementById("drawMandelbrotButton")
buttonElement.onclick = drawMandelbrot;

drawMandelbrot()
makeRandomLayers()

console.log(randomLayers);

function drawMandelbrot(){
    buttonElement.disabled = true;

    var zoom = parseFloat(zoomElement.value)

    console.log(zoom)

    var modelWidth = ((modelRight - modelLeft)/zoom)
    var modelHeight = ((modelTop - modelBottom)/zoom)

    console.log(modelWidth, modelHeight)

    modelLeft   = centerVirtualX - (modelWidth / 2.0)
    modelRight  = centerVirtualX + (modelWidth / 2.0)
    modelBottom = centerVirtualY - (modelHeight / 2.0)
    modelTop    = centerVirtualY + (modelHeight / 2.0)

    console.log(modelLeft, modelRight, modelBottom, modelTop)

    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    
    console.log("Drawing Mandelbrot")
    for(var Py = 0; Py < screenSizeY; Py++){
        for(var Px = 0; Px < screenSizeX; Px++){

            var x0 = modelLeft + (parseFloat(Px) * (modelRight - modelLeft) / parseFloat(screenSizeX) );
            var y0 = modelTop - (parseFloat(Py) * (modelTop - modelBottom) / parseFloat(screenSizeY) );
            //console.log("Px ", Px, " Py ", Py, " x0 ", x0, " y0 ", y0);

            var x = 0.0;
            var y = 0.0;

            var iteration = 0;
            var maxIteration = 255;

            var x2 = 0.0;
            var y2 = 0.0;
            var w = 0.0;

            while( x2 + y2 <= 4.0 && iteration < maxIteration){
                x = x2 - y2 + x0;
                y = w - x2 - y2 + y0;
                x2 = x*x;
                y2 = y*y;
                w = (x+y) * (x+y);
                iteration++;
            }

            //draw pixel
            if(randomLayersElement.checked){

                var rColor = randomLayers[iteration * 3]
                var gColor = randomLayers[(iteration * 3) + 1]
                var bColor = randomLayers[(iteration * 3) + 2]
                rgb = `rgb(${rColor},${gColor},${bColor})` ;
            }
            else if(randomElement.checked){
                rgb = `rgb(${parseInt(Math.random() * iteration)},${parseInt(Math.random() * iteration)},${parseInt(Math.random() * iteration)})` ;
            } else{
                rgb = `rgb(${iteration},${iteration},${iteration})` ;
            }
            //console.log("rgb ", rgb, "iteration ", iteration, " Px ", Px, " Py ", Py)
            canvasContext.fillStyle = rgb;
            canvasContext.fillRect( Px, Py, 1, 1);

        }
    }
    console.log("done");
    zoomElement.value = 1;
    buttonElement.disabled = false;
}

setCenter( [screenSizeX/2, screenSizeY/2] )

function setCenter(point){

    centerElement.innerHTML = "Screen Center ( " + point[0] + ", " + point[1] + ")"
    centerX = parseInt(point[0])
    centerY = parseInt(point[1])
    // make aditional field for model center
    centerVirtualX = modelLeft + (parseFloat(point[0]) * (modelRight - modelLeft) / parseFloat(screenSizeX) );
    centerVirtualY = modelTop - (parseFloat(point[1]) * (modelTop - modelBottom) / parseFloat(screenSizeY) );
    centerVirtualElement.innerHTML = "Virtual Center ( " + centerVirtualX + ", " + centerVirtualY + ")"

}

function setCanvasSize(newWidth, newHeight){

    if(doubleResolutionElement.checked){
        newWidth = newWidth * 2;
        newHeight = newHeight * 2;
    }

    canvasElement.style.width = newWidth + "px";
    canvasElement.style.height = newHeight + "px";
    canvasElement.width = newWidth;
    canvasElement.height = newHeight;
    screenSizeX = newWidth;
    screenSizeY = newHeight;

    console.log(canvasElement.style)


    drawMandelbrot();

}

function makeRandomLayers(){
    randomLayers = []
    var max = 256;
    for(var i = 0; i < max; i++){
        for(var j = 0; j < 3; j++){
            layerColor = parseInt(Math.random() * i);
            randomLayers.push(layerColor);
        }

    }

    zoomElement.value = 1;
    drawMandelbrot();
    
}
