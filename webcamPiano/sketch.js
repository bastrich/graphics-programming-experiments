let video;
let prevImg;
let diffImg;
let currImg;
let thresholdSlider;
let grid;

function setup() {
    createCanvas(640 * 2, 480 + 40);
    pixelDensity(1);

    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);

    grid = new Grid(640,480);
}

function draw() {
    background(0);

    let threshold = thresholdSlider.value();

    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    currImg.resize(currImg.width / 2, currImg.height / 2);
    currImg.filter(BLUR, 3);

    diffImg = createImage(video.width, video.height);
    diffImg.resize(diffImg.width / 2, diffImg.height / 2);
    diffImg.loadPixels();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                var index = (x + (y * currImg.width)) * 4;
                var redSource = currImg.pixels[index + 0];
                var greenSource = currImg.pixels[index + 1];
                var blueSource = currImg.pixels[index + 2];

                var redBack = prevImg.pixels[index + 0];
                var greenBack = prevImg.pixels[index + 1];
                var blueBack = prevImg.pixels[index + 2];

                var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }
    diffImg.updatePixels();

    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);

    image(video, 0, 0);
    image(diffImg, 640, 0, 640, 480);

    push();
        textSize(30);
        stroke(255);
        strokeWeight(3);
        text("Click mouse button to start playing sounds", 10, 480 + 35);
    pop();

    grid.run(diffImg);

    push();
        noFill();
        stroke(255);
        strokeWeight(1);
        text(threshold, 160, 35);
    pop();
}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
  var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
  return d;
}

function mousePresses() {
    userStartAudio();
}