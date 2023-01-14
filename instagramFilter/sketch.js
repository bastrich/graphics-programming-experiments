// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
let imgIn;

let matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
let unsharpMaskingMatrix = [
    [-1/256, -4/256, -6/256, -4/256, -1/256],
    [-4/256, -16/256, -24/256, -16/256, -4/256],
    [-6/256, -24/256, 476/256, -24/256, -6/256],
    [-4/256, -16/256, -24/256, -16/256, -4/256],
    [-1/256, -4/256, -6/256, -4/256, -1/256]
];

let filterPresets = [
  earlyBirdFilter, 
  myCustomFilter1,
  myCustomFilter2
];
let currentFilterPresetIndex = 0;

/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height + 40);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);

    let currentFilterPreset = filterPresets[currentFilterPresetIndex];
    image(currentFilterPreset(imgIn), imgIn.width, 0);

    textSize(30);
    fill(255);
    text("Press LEFT or RIGHT arrows to switch between filter presets", 10, imgIn.height + 35)

    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}

function keyPressed() { 
  if (keyCode == LEFT_ARROW) {
    currentFilterPresetIndex--;
    if (currentFilterPresetIndex < 0) {
      currentFilterPresetIndex = filterPresets.length - 1;
    }
    loop();
  } else if (keyCode == RIGHT_ARROW) {
    currentFilterPresetIndex++;
    if (currentFilterPresetIndex >= filterPresets.length) {
      currentFilterPresetIndex = 0;
    }
    loop();
  }
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = sepiaFilter(imgIn);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}

function sepiaFilter(img) {
  img.loadPixels();

  let resultImg = createImage(img.width, img.height);
  resultImg.loadPixels();

  for (let x = 0; x < resultImg.width; x++) {
    for (let y = 0; y < resultImg.height; y++) {
        let pixelIndex = (resultImg.width * y + x) * 4;

        let oldRed = img.pixels[pixelIndex + 0];
        let oldGreen = img.pixels[pixelIndex + 1];
        let oldBlue = img.pixels[pixelIndex + 2];

        resultImg.pixels[pixelIndex + 0] = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189);
        resultImg.pixels[pixelIndex + 1] = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168);
        resultImg.pixels[pixelIndex + 2] = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131);
        resultImg.pixels[pixelIndex + 3] = 255;
    }
  }

  resultImg.updatePixels();
  return resultImg;
}

function darkCorners(img) {
  img.loadPixels();

  let resultImg = createImage(img.width, img.height);
  resultImg.loadPixels();

  for (let x = 0; x < resultImg.width; x++) {
    for (let y = 0; y < resultImg.height; y++) {
        let pixelIndex = (resultImg.width * y + x) * 4;

        let oldRed = img.pixels[pixelIndex + 0];
        let oldGreen = img.pixels[pixelIndex + 1];
        let oldBlue = img.pixels[pixelIndex + 2];

        let dynLam = 1;
        let ditanceFromImageCenter = dist(x, y, resultImg.width / 2, resultImg.height / 2);
        let maxDitanceFromImageCenter = dist(0, 0, resultImg.width / 2, resultImg.height / 2);
        if (ditanceFromImageCenter >= 300 && ditanceFromImageCenter < 450) {
          dynLam = map(ditanceFromImageCenter, 300, 450, 1, 0.4);
        } else if (ditanceFromImageCenter >= 450) {
          dynLam = map(ditanceFromImageCenter, 450, maxDitanceFromImageCenter, 0.4, 0);
        }

        resultImg.pixels[pixelIndex + 0] = oldRed * dynLam;
        resultImg.pixels[pixelIndex + 1] = oldGreen * dynLam;
        resultImg.pixels[pixelIndex + 2] = oldBlue * dynLam;
        resultImg.pixels[pixelIndex + 3] = 255;
    }
  }

  resultImg.updatePixels();
  return resultImg;
}

function radialBlurFilter(img) {
  img.loadPixels();

  let resultImg = createImage(img.width, img.height);
  resultImg.loadPixels();

  for (let x = 0; x < resultImg.width; x++) {
    for (let y = 0; y < resultImg.height; y++) {
        let pixelIndex = (resultImg.width * y + x) * 4;

        let oldRed = img.pixels[pixelIndex + 0];
        let oldGreen = img.pixels[pixelIndex + 1];
        let oldBlue = img.pixels[pixelIndex + 2];

        let c = convolution(x, y, matrix, matrix.length, img);

        let ditanceFromMouse = dist(x, y, mouseX - img.width, mouseY);
        let dynBlur = constrain(map(ditanceFromMouse, 100, 300, 0, 1), 0, 1);
        

        resultImg.pixels[pixelIndex + 0] = c[0]*dynBlur + oldRed*(1-dynBlur);
        resultImg.pixels[pixelIndex + 1] = c[1]*dynBlur + oldGreen*(1-dynBlur);
        resultImg.pixels[pixelIndex + 2] = c[2]*dynBlur + oldBlue*(1-dynBlur);
        resultImg.pixels[pixelIndex + 3] = 255;
    }
  }

  resultImg.updatePixels();
  return resultImg;
}

/**
 * applies unsharp masking kernel and grayscale filter
 */
function myCustomFilter1(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = grayScaleFilter(img);
  resultImg = unsharpMaskingFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}

function unsharpMaskingFilter(img) {
  img.loadPixels();

  let resultImg = createImage(img.width, img.height);
  resultImg.loadPixels();

  for (let x = 0; x < resultImg.width; x++) {
    for (let y = 0; y < resultImg.height; y++) {
        let pixelIndex = (resultImg.width * y + x) * 4;

        let c = convolution(x, y, unsharpMaskingMatrix, unsharpMaskingMatrix.length, img);        

        resultImg.pixels[pixelIndex + 0] = c[0];
        resultImg.pixels[pixelIndex + 1] = c[1];
        resultImg.pixels[pixelIndex + 2] = c[2];
        resultImg.pixels[pixelIndex + 3] = 255;
    }
  }

  resultImg.updatePixels();
  return resultImg;
}

function grayScaleFilter(img) {
  img.loadPixels();

  let resultImg = createImage(img.width, img.height);
  resultImg.loadPixels();

  for (let x = 0; x < resultImg.width; x++) {
    for (let y = 0; y < resultImg.height; y++) {
        let pixelIndex = (resultImg.width * y + x) * 4;

        let oldRed = img.pixels[pixelIndex + 0];
        let oldGreen = img.pixels[pixelIndex + 1];
        let oldBlue = img.pixels[pixelIndex + 2];

        let newGray = max(oldRed, oldGreen, oldBlue);

        resultImg.pixels[pixelIndex + 0] = newGray;
        resultImg.pixels[pixelIndex + 1] = newGray;
        resultImg.pixels[pixelIndex + 2] = newGray;
        resultImg.pixels[pixelIndex + 3] = 255;
    }
  }

  resultImg.updatePixels();
  return resultImg;
}

/**
 * applies halftone filter
 */
function myCustomFilter2(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = halftoneFilter(img);
  resultImg = borderFilter(resultImg)
  return resultImg;
}

function halftoneFilter(img) {
  img.loadPixels();

  let resultImg = createGraphics(img.width, img.height);

  let stepSize = 2;

  resultImg.noStroke();
  resultImg.fill(0);
  resultImg.rect(0, 0, resultImg.width, resultImg.height);

  for (let x = 0; x < resultImg.width; x += stepSize) {
    for (let y = 0; y < resultImg.height; y += stepSize) {
        let pixelIndex = (resultImg.width * y + x) * 4;

        let oldRed = img.pixels[pixelIndex + 0];
        let oldGreen = img.pixels[pixelIndex + 1];
        let oldBlue = img.pixels[pixelIndex + 2];
        
        let brightness = 0.299 * oldRed + 0.587 * oldGreen + 0.114 * oldBlue;
        let diameter = map(brightness, 0, 255, 0, stepSize);

        resultImg.fill(oldRed, oldGreen, oldBlue);
        resultImg.ellipse(
          x,
          y,
          diameter,
          diameter
        );
    }
  }

  return resultImg;
}

function convolution(x, y, matrix, matrixSize, img) {
  var totalRed = 0.0;
  var totalGreen = 0.0;
  var totalBlue = 0.0;
  var offset = floor(matrixSize / 2);

  // convolution matrix loop
  for (var i = 0; i < matrixSize; i++) {
      for (var j = 0; j < matrixSize; j++) {
          // Get pixel loc within convolution matrix
          var xloc = x + i - offset;
          var yloc = y + j - offset;
          var index = (xloc + img.width * yloc) * 4;
          // ensure we don't address a pixel that doesn't exist
          index = constrain(index, 0, img.pixels.length - 1);

          // multiply all values with the mask and sum up
          totalRed += img.pixels[index + 0] * matrix[i][j];
          totalGreen += img.pixels[index + 1] * matrix[i][j];
          totalBlue += img.pixels[index + 2] * matrix[i][j];
      }
  }
  // return the new color
  return [totalRed, totalGreen, totalBlue];
}

function borderFilter(img) {
  let resultImg = createGraphics(img.width, img.height);

  resultImg.image(img, 0, 0);
  resultImg.stroke(255);
  resultImg.strokeWeight(30);
  resultImg.noFill();
  resultImg.rect(0, 0, img.width, img.height, 45);
  resultImg.rect(0, 0, img.width, img.height)

  return resultImg;
}