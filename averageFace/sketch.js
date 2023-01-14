let numOfImages = 30;

let imgs = [];
let avgImg;

let imgWidth;
let imgHeight;

let originalFaceImg;

//////////////////////////////////////////////////////////
function preload() { // preload() runs once
    for (let i = 0; i < 30; i++) {
        imgs[i] = loadImage('assets/' + i + '.jpg');
    }
}
//////////////////////////////////////////////////////////
function setup() {
    imgWidth = imgs[0].width;
    imgHeight = imgs[0].height;

    createCanvas(imgWidth * 2, imgHeight);
    pixelDensity(1);

    avgImg = createGraphics(imgWidth, imgHeight);

    updateOriginalFaceImg();
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);

    for (let i = 0; i < imgs.length; i++) {
        imgs[i].loadPixels();
    }
    avgImg.loadPixels();

    for (let x = 0; x < imgWidth; x++) {
        for (let y = 0; y < imgHeight; y++) {
            let pixelIndex = (imgWidth * y + x) * 4;

            let sumR = 0;
            let sumG = 0;
            let sumB = 0;

            for (let i = 0; i < imgs.length; i++) {
                sumR += imgs[i].pixels[pixelIndex + 0];
                sumG += imgs[i].pixels[pixelIndex + 1];
                sumB += imgs[i].pixels[pixelIndex + 2];
            }

            avgImg.pixels[pixelIndex + 0] = lerp(originalFaceImg.pixels[pixelIndex + 0], sumR / imgs.length, mouseX / width) ;
            avgImg.pixels[pixelIndex + 1] = lerp(originalFaceImg.pixels[pixelIndex + 1], sumG / imgs.length, mouseX / width) ;
            avgImg.pixels[pixelIndex + 2] = lerp(originalFaceImg.pixels[pixelIndex + 2], sumB / imgs.length, mouseX / width) ;
            avgImg.pixels[pixelIndex + 3] = 255;
        }
    }

    avgImg.updatePixels();

    image(originalFaceImg, 0, 0);
    image(avgImg, imgWidth, 0);

    noLoop();
}

function updateOriginalFaceImg() {
    originalFaceImg = imgs[floor(random(imgs.length))];
}

function keyPressed() {
    updateOriginalFaceImg();
    loop();
}

function mouseMoved(event) {
    loop();
}
