let confLocs = [];
let confTheta = [];
let confColors = []

let cubeMaxHeightSlider;
let waveSpeedSlider;

function setup() {
    createCanvas(900, 800, WEBGL);
    angleMode(DEGREES);

    for(let i = 0; i < 200; i++) { 
        confLocs.push(new p5.Vector(random(-500, 500), random(-800, 0), random(-500, 500)));
    }

    for(let i = 0; i < 200; i++) { 
        confTheta.push(random(360));
    }

    for(let i = 0; i < 200; i++) { 
        confColors.push(color(random(255), random(255), random(255)));
    }

    cubeMaxHeightSlider = createSlider(150, 700, 300, 0);
    cubeMaxHeightSlider.position(50, 10);
    cubeMaxHeightSlider.style('width', '80px');

    waveSpeedSlider = createSlider(0.5, 5, 1, 0);
    waveSpeedSlider.position(50, 30);
    waveSpeedSlider.style('width', '80px');
}

function draw() {
    background(125);
    
    // normalMaterial();
    // stroke(0);
    // strokeWeight(2)

    strokeWeight(0);
    
    pointLight(255, 255, 255, cos(frameCount) * 1131, -1200, sin(frameCount) * 1131);
    pointLight(255, 255, 255, cos(frameCount + 50) * 1131, -800, sin(frameCount + 50) * 1131);
    pointLight(255, 255, 255, cos(frameCount - 50) * 1131, -800, sin(frameCount - 50) * 1131);

    for(let i = 0; i < 16; i++) {
        for(let j = 0; j < 16; j++) {
            let distance = dist(-375 + i * 50 , -375 + j * 50 , 0, 0);
            let length = map(sin(distance + frameCount * waveSpeedSlider.value()), -1, 1, 100, cubeMaxHeightSlider.value());

            push();
                ambientMaterial(lerpColor(color(106, 90, 205), color(173, 255, 47), map(sin(distance + frameCount), -1, 1, 0, 1)));
                translate(-375 + i * 50, 0, -375 + j * 50);
                box(50, length, 50);
            pop();
        }
    }

    confetti();

    camera(cos(frameCount) * 1131, -600, sin(frameCount) * 1131, 0, 0, 0, 0, 1, 0);
}

function confetti() {
    for(let i = 0; i < confLocs.length; i++) { 
        push();
            translate(confLocs[i].x, confLocs[i].y, confLocs[i].z);
            rotate(confTheta[i], confLocs[i]);
            noStroke();
            specularMaterial(confColors[i]);
            shininess(20);
            plane(15, 15);
        pop();

        confLocs[i].y += 1;
        confTheta[i] += 10;

        if (confLocs[i].y > 0) {
            confLocs[i].y = -800;
        }
    }
}