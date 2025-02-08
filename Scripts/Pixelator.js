// Take an image. Choose 5(?) colors. Go pixel by pixel and determain the euclidian difference from the pixel to each color. That pixel is replaced by the closest color.
bodyElement = document.getElementById("body");

canvasElement = document.getElementById("outputCanvas");
canvasElement.width = 400;
canvasElement.height = 400;
canvasContext = canvasElement.getContext("2d");

function pixelatePicture() {
  console.log("Pixelator!!");
}

/**
 *  Finds and returns average color.
 *
 *
 * @returns {Array} - [r,g,b] holding Reg Green Blue of average color
 */
function setAverageColors() {
  var averageColors = getAverageColor();
  var compAverageColors = getCompColor(averageColors);
  setColorToCanvas("colorCompCanvas", compAverageColors);
  var midColor = getMidPoint(compAverageColors, averageColors);
  var compMidColor = getCompColor(midColor);
  setColorToCanvas("compMidCanvas", compMidColor);
}

/**
 *  Finds midpoint of two colors
 *
 * @param {Array} point1
 * @param {Array} point2
 *
 * @returns {Array} - [r,g,b] holding Reg Green Blue of average color
 */
function getMidPoint(point1, point2) {
  return [
    Math.floor((point1[0] + point2[0]) / 2),
    Math.floor((point1[1] + point2[1]) / 2),
    Math.floor((point1[2] + point2[2]) / 2),
  ];
}

/**
 *  Finds and returns average color.
 *
 * @param {Array} colors - int representation of colors r g b
 *
 * @returns {string} #RRGGBB hex representation of colors
 */
function convertIntColorToHex(colors) {
  var returnColorHex =
    "#" +
    colors[0].toString(16).padStart(2, "0").toUpperCase() +
    colors[1].toString(16).padStart(2, "0").toUpperCase() +
    colors[2].toString(16).padStart(2, "0").toUpperCase();
  return returnColorHex;
}

/**
 *  Finds and returns average color.
 *
 * @param {string} elementId - Id of Canvas to set color to.
 * @param {Array} color - [r,g,b] colors to find the comp to.
 *
 */
function setColorToCanvas(elementId, color) {
  const canvas = document.getElementById(elementId);
  const ctx = canvas.getContext("2d");
  var returnColorHex = convertIntColorToHex(color);
  ctx.fillStyle = returnColorHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 *  Finds and returns average color.
 *
 * @param {Array} originalColors - [r,g,b] colors to find the comp to.
 *
 * @returns {Array} - [r,g,b] holding Reg Green Blue of average color
 */
function getCompColor(originalColors) {
  var rComp = Math.abs(originalColors[0] - 255);
  var gComp = Math.abs(originalColors[1] - 255);
  var bComp = Math.abs(originalColors[2] - 255);
  return [rComp, gComp, bComp];
}
/**
 *  Finds and returns average color.
 *
 *
 * @returns {Array} - Tuple holding Reg Green Blue of average color
 */
function getAverageColor() {
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
  const inputImage = document.getElementById("imageDisplay");
  const ctx = inputImage.getContext("2d");

  // Do something with the bitmap
  var rSum = 0;
  var gSum = 0;
  var bSum = 0;
  var pixelCount = inputImage.width * inputImage.height;
  for (let x = 0; x < inputImage.width; x++) {
    for (let y = 0; y < inputImage.height; y++) {
      const pixel = ctx.getImageData(x, y, 1, 1);
      const data = pixel.data;
      rSum += data[0];
      gSum += data[1];
      bSum += data[2];
    }
  }
  console.log(rSum);
  console.log(gSum);
  console.log(bSum);
  rAverage = Math.floor(rSum / pixelCount);
  gAverage = Math.floor(gSum / pixelCount);
  bAverage = Math.floor(bSum / pixelCount);
  console.log(rAverage);
  console.log(gAverage);
  console.log(bAverage);
  const returnArray = [rAverage, gAverage, bAverage];
  console.log(
    "Average Color: " +
      returnArray[0] +
      ", " +
      returnArray[1] +
      ", " +
      returnArray[2]
  );
  setColorToCanvas("averageColorCanvas", [rAverage, gAverage, bAverage]);

  return returnArray;
}

// variables

screenSizeX = 400;
screenSizeY = 400;

buttonElement = document.getElementById("pixelateButton");
buttonElement.onclick = pixelatePicture;

buttonGetAverageElement = document.getElementById("getAverageButton");
buttonGetAverageElement.onclick = setAverageColors;

// Add Listener to Choose File Button
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const inputImage = document.getElementById("imageDisplay");
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = e.target.result;
        // const inputImage = document.getElementById("canvas");
        const ctx = inputImage.getContext("2d");
        img.addEventListener("load", () => {
          console.log("Image w,h " + img.width + ", " + img.height);
          // inputImage.setAttribute("width", ctx.width);
          // inputImage.setAttribute("height", ctx.height);
          inputImage.setAttribute("width", img.width);
          inputImage.setAttribute("height", img.height);
          // inputImage.width = ctx.width;
          // inputImage.height = ctx.height;
          ctx.drawImage(img, 0, 0);
          // img.style.display = "none";
        });
        inputImage.style.display = "block";
        console.log(inputImage.attributes);
      };
      reader.readAsDataURL(file);
    }
  });
