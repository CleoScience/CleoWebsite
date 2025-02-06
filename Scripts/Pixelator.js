// Take an image. Choose 5(?) colors. Go pixel by pixel and determain the euclidian difference from the pixel to each color. That pixel is replaced by the closest color.
bodyElement = document.getElementById("body");

canvasElement = document.getElementById("mandelbrotCanvas");
canvasElement.width = 400;
canvasElement.height = 400;
canvasContext = canvasElement.getContext('2d');
canvasElement.onclick = canvasClick;


zoomElement = document.getElementById("zoom")
centerElement = document.getElementById("center");
centerVirtualElement = document.getElementById("centerVirtual");
statsParagraphElement = document.getElementById("stats");
doubleResolutionElement = document.getElementById("doubleResolution");
statusElement = document.getElementById("status");

randomLayersElement = document.getElementById("randomLayers");
randomLayersElement.onclick = randomLayersClick;

randomElement = document.getElementById("random");
randomElement.onclick = randomClick;

resetRandomElement = document.getElementById("resetRandomLayers");
resetRandomElement.onclick = makeRandomLayers;

borderOnlyElement = document.getElementById("borderOnly");
borderOnlyElement.onclick = makeBorder;

setThreeColorsElement = document.getElementById("setThreeColors");
setThreeColorsElement.onclick = setThreeColorsClick;

setSpectrumElement = document.getElementById("setSpectrum");
setSpectrumElement.onclick = setSpectrumClick;

colorPickerElement = document.getElementById("colorPicker");
spectrumColorPickerElement = document.getElementById("spectrumColorPicker");

customColorOneElement = document.getElementById("customColorOne");
customColorTwoElement = document.getElementById("customColorTwo");
customColorThreeElement = document.getElementById("customColorThree");
customColorOneElement.onchange = colorChange;
customColorTwoElement.onchange = colorChange;
customColorThreeElement.onchange = colorChange;

customColors = []

spectrumColorOneElement = document.getElementById("spectrumColorOne");
spectrumColorTwoElement = document.getElementById("spectrumColorTwo");
spectrumColorOneElement.onchange = spectrumColorChange;
spectrumColorTwoElement.onchange = spectrumColorChange;

spectrumColors = []

function colorChange() {
    customColors = [] // clear array
    customColors.push(customColorOneElement.value)
    customColors.push(customColorTwoElement.value)
    customColors.push(customColorThreeElement.value)
    console.log(customColors)
}
function spectrumColorChange() {
    spectrumColors = [] // clear array
    spectrumColors.push(spectrumColorOneElement.value)
    spectrumColors.push(spectrumColorTwoElement.value)
    console.log(spectrumColors)
    setSpecturmColors();
}

function setThreeColorsClick() {
    if (setThreeColorsElement.checked) {
        setOptions([false, false, true, false])
    } else {
        setOptions([false, false, false, false])
    }
}

function setSpectrumClick() {
    if (setSpectrumElement.checked) {
        setOptions([false, false, false, true])
    } else {
        setOptions([false, false, false, false])
    }
}

function randomLayersClick() {

    if (randomLayersElement.checked) {
        setOptions([true, false, false, false])
    } else {
        setOptions([false, false, false, false])
    }
}

function randomClick() {
    if (randomElement.checked) {
        setOptions([false, true, false, false])
    } else {
        setOptions([false, false, false, false])
    }
}

function setColorPickerVisibility() {
    if (setThreeColorsElement.checked) {
        colorPickerElement.style.visibility = "visible";
    } else {
        colorPickerElement.style.visibility = "collapse";
    }
    if (setSpectrumElement.checked) {
        spectrumColorPickerElement.style.visibility = "visible";
    } else {
        spectrumColorPickerElement.style.visibility = "collapse";
    }
}

function setOptions(options) {
    randomLayersElement.checked = options[0]
    randomElement.checked = options[1]
    setThreeColorsElement.checked = options[2]
    setSpectrumElement.checked = options[3]
    setColorPickerVisibility()
}

function canvasClick(event) {
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

screenSizeX = 400;
screenSizeY = 400;
modelLeft = -2.0;
modelRight = 2.0;
modelBottom = -2.0;
modelTop = 2.0;
centerX = 0.0;
centerY = 0.0;
centerVirtualX = 0.0;
centerVirtualY = 0.0;

borderThickness = 1;

randomLayers = [];
spectrumLayers = [];


buttonElement = document.getElementById("drawMandelbrotButton")
buttonElement.onclick = drawMandelbrot;

resetButtonElement = document.getElementById("resetButton")
resetButtonElement.onclick = resetMandelbrot;

drawMandelbrot()
makeRandomLayers()
colorChange()
spectrumColorChange()

console.log(randomLayers);

function drawMandelbrot() {
    buttonElement.disabled = true;

    var zoom = parseFloat(zoomElement.value)

    console.log(zoom)

    var modelWidth = ((modelRight - modelLeft) / zoom)
    var modelHeight = ((modelTop - modelBottom) / zoom)

    console.log(modelWidth, modelHeight)

    modelLeft = centerVirtualX - (modelWidth / 2.0)
    modelRight = centerVirtualX + (modelWidth / 2.0)
    modelBottom = centerVirtualY - (modelHeight / 2.0)
    modelTop = centerVirtualY + (modelHeight / 2.0)

    console.log(modelLeft, modelRight, modelBottom, modelTop)

    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);


    console.log("Drawing Mandelbrot")
    for (var Py = 0; Py < screenSizeY; Py++) {
        for (var Px = 0; Px < screenSizeX; Px++) {

            var x0 = modelLeft + (parseFloat(Px) * (modelRight - modelLeft) / parseFloat(screenSizeX));
            var y0 = modelTop - (parseFloat(Py) * (modelTop - modelBottom) / parseFloat(screenSizeY));
            //console.log("Px ", Px, " Py ", Py, " x0 ", x0, " y0 ", y0);

            var x = 0.0;
            var y = 0.0;

            var iteration = 0;
            var maxIteration = 255;

            var x2 = 0.0;
            var y2 = 0.0;
            var w = 0.0;

            while (x2 + y2 <= 4.0 && iteration < maxIteration) {
                x = x2 - y2 + x0;
                y = w - x2 - y2 + y0;
                x2 = x * x;
                y2 = y * y;
                w = (x + y) * (x + y);
                iteration++;
            }

            //draw pixel
            if (randomLayersElement.checked) {

                var rColor = randomLayers[iteration * 3]
                var gColor = randomLayers[(iteration * 3) + 1]
                var bColor = randomLayers[(iteration * 3) + 2]
                rgb = `rgb(${rColor},${gColor},${bColor})`;
            }
            else if (setThreeColorsElement.checked) {
                rgb = customColors[iteration % 3];
                // console.log(rgb)
            }
            else if (randomElement.checked) {
                rgb = `rgb(${parseInt(Math.random() * iteration)},${parseInt(Math.random() * iteration)},${parseInt(Math.random() * iteration)})`;
            }
            else if (setSpectrumElement.checked) {

                var rColor = spectrumLayers[iteration * 3]
                var gColor = spectrumLayers[(iteration * 3) + 1]
                var bColor = spectrumLayers[(iteration * 3) + 2]
                rgb = `rgb(${rColor},${gColor},${bColor})`;

            }
            else if (borderOnly.checked) {
                if (iteration < 256 - borderThickness) {
                    rgb = `rgb(${iteration},${iteration},${iteration})`;
                } else {
                    rgb = `rgb(${0},${0},${0})`;
                }

            } else {
                rgb = `rgb(${iteration},${iteration},${iteration})`;
            }
            //console.log("rgb ", rgb, "iteration ", iteration, " Px ", Px, " Py ", Py)
            canvasContext.fillStyle = rgb;
            canvasContext.fillRect(Px, Py, 1, 1);

        }
    }
    console.log("done");
    zoomElement.value = 1;
    buttonElement.disabled = false;
}

setCenter([screenSizeX / 2, screenSizeY / 2])

function setCenter(point) {

    centerElement.innerHTML = "Screen Center ( " + point[0] + ", " + point[1] + ")"
    centerX = parseInt(point[0])
    centerY = parseInt(point[1])
    // make aditional field for model center
    centerVirtualX = modelLeft + (parseFloat(point[0]) * (modelRight - modelLeft) / parseFloat(screenSizeX));
    centerVirtualY = modelTop - (parseFloat(point[1]) * (modelTop - modelBottom) / parseFloat(screenSizeY));
    centerVirtualElement.innerHTML = "Virtual Center ( " + centerVirtualX + ", " + centerVirtualY + ")"

}

function setCanvasSize(newWidth, newHeight) {

    if (doubleResolutionElement.checked) {
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

function setSpecturmColors() {

    spectrumLayers = []
    var max = 256;
    var oneWeight = 0;
    var twoWeight = 256;
    var r;
    var g;
    var b;

    for (var i = 0; i < max; i++) {
        r = Math.max(parseInt(parseInt(spectrumColors[0].slice(1, 3), 16) - oneWeight), parseInt(parseInt(spectrumColors[1].slice(1, 3), 16) - twoWeight));
        g = Math.max(parseInt(parseInt(spectrumColors[0].slice(3, 5), 16) - oneWeight), parseInt(parseInt(spectrumColors[1].slice(3, 5), 16) - twoWeight));
        b = Math.max(parseInt(parseInt(spectrumColors[0].slice(5, 7), 16) - oneWeight), parseInt(parseInt(spectrumColors[1].slice(5, 7), 16) - twoWeight));
        if (r < 0) {
            r = 0;
        }
        if (g < 0) {
            g = 0;
        }
        if (b < 0) {
            b = 0;
        }
        spectrumLayers.push(r);
        spectrumLayers.push(g);
        spectrumLayers.push(b);

        oneWeight++;
        twoWeight--;
    }

    drawMandelbrot();

}

function makeRandomLayers() {

    randomElement.checked = false;

    randomLayers = []
    var max = 256;
    for (var i = 0; i < max; i++) {
        for (var j = 0; j < 3; j++) {
            layerColor = parseInt(Math.random() * i);
            randomLayers.push(layerColor);
        }
    }

    r = randomLayers[255 * 3];
    g = randomLayers[255 * 3 + 1];
    b = randomLayers[255 * 3 + 2];
    bodyElement.style.background = `rgb(${r},${g},${b})`;

    zoomElement.value = 1;
    drawMandelbrot();

}

function resetMandelbrot() {

    modelLeft = -2.0
    modelRight = 2.0
    modelBottom = -2.0
    modelTop = 2.0
    centerX = 0.0
    centerY = 0.0
    centerVirtualX = 0.0
    centerVirtualY = 0.0

    drawMandelbrot();
}

function makeBorder() {
    makeRandomLayersBorder();
    //setSpectrumClickBorder();
}
function makeRandomLayersBorder() {

    randomElement.checked = false;

    outsideColor = [parseInt(Math.random() * 256), parseInt(Math.random() * 256), parseInt(Math.random() * 256)]
    borderColor = [parseInt(Math.random() * 256), parseInt(Math.random() * 256), parseInt(Math.random() * 256)]
    insideColor = [parseInt(Math.random() * 256), parseInt(Math.random() * 256), parseInt(Math.random() * 256)]

    outsideLimit = 255 - borderThickness

    randomLayers = []
    var max = 256;
    for (var i = 0; i < outsideLimit; i++) {
        for (var j = 0; j < 3; j++) {
            randomLayers.push(outsideColor[j]);
        }
    }
    for (var i = 0; i < borderThickness; i++) {
        for (var j = 0; j < 3; j++) {
            randomLayers.push(borderColor[j]);
        }
    }
    for (var j = 0; j < 3; j++) {
        randomLayers.push(insideColor[j]);
    }

    r = randomLayers[255 * 3];
    g = randomLayers[255 * 3 + 1];
    b = randomLayers[255 * 3 + 2];
    bodyElement.style.background = `rgb(${r},${g},${b})`;

    zoomElement.value = 1;
    drawMandelbrot();

}

function setSpectrumClickBorder() {

    spectrumLayers = []
    var max = 256;
    var oneWeight = 0;
    var twoWeight = 256;
    var r;
    var g;
    var b;

    for (var i = 0; i < max - borderThickness; i++) {
        r = parseInt(parseInt(spectrumColors[0].slice(1, 3), 16));
        g = parseInt(parseInt(spectrumColors[0].slice(3, 5), 16));
        b = parseInt(parseInt(spectrumColors[0].slice(5, 7), 16));

        spectrumLayers.push(r);
        spectrumLayers.push(g);
        spectrumLayers.push(b);
    }

    for (var i = 0; i < borderThickness; i++) {
        r = Math.max(parseInt(parseInt(spectrumColors[0].slice(1, 3), 16) - oneWeight), parseInt(parseInt(spectrumColors[1].slice(1, 3), 16) - twoWeight));
        g = Math.max(parseInt(parseInt(spectrumColors[0].slice(3, 5), 16) - oneWeight), parseInt(parseInt(spectrumColors[1].slice(3, 5), 16) - twoWeight));
        b = Math.max(parseInt(parseInt(spectrumColors[0].slice(5, 7), 16) - oneWeight), parseInt(parseInt(spectrumColors[1].slice(5, 7), 16) - twoWeight));
        if (r < 0) {
            r = 0;
        }
        if (g < 0) {
            g = 0;
        }
        if (b < 0) {
            b = 0;
        }
        spectrumLayers.push(r);
        spectrumLayers.push(g);
        spectrumLayers.push(b);

        oneWeight++;
        twoWeight--;
    }
    for (var i = 0; i < borderThickness; i++) {
        r = parseInt(parseInt(spectrumColors[1].slice(1, 3), 16));
        g = parseInt(parseInt(spectrumColors[1].slice(3, 5), 16));
        b = parseInt(parseInt(spectrumColors[1].slice(5, 7), 16));

        spectrumLayers.push(r);
        spectrumLayers.push(g);
        spectrumLayers.push(b);

        oneWeight++;
        twoWeight--;
    }

}
