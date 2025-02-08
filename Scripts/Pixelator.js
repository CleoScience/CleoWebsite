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
 * @returns {tuple} - Tuple holding Reg Green Blue of average color
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
  const returnTuple = [rAverage, gAverage, bAverage];
  console.log(
    "Average Color: " +
      returnTuple[0] +
      ", " +
      returnTuple[1] +
      ", " +
      returnTuple[2]
  );
  var returnColorHex =
    "#" +
    rAverage.toString(16).padStart(2, "0").toUpperCase() +
    gAverage.toString(16).padStart(2, "0").toUpperCase() +
    bAverage.toString(16).padStart(2, "0").toUpperCase();
  console.log(returnColorHex);
  const averageColorCanvas = document.getElementById("averageColorCanvas");
  const averageColorCtx = averageColorCanvas.getContext("2d");

  averageColorCtx.fillStyle = returnColorHex;
  averageColorCtx.fillRect(
    0,
    0,
    averageColorCanvas.width,
    averageColorCanvas.height
  );

  return returnTuple;
}

// variables

screenSizeX = 400;
screenSizeY = 400;

buttonElement = document.getElementById("pixelateButton");
buttonElement.onclick = pixelatePicture;

buttonGetAverageElement = document.getElementById("getAverageButton");
buttonGetAverageElement.onclick = getAverageColor;

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
