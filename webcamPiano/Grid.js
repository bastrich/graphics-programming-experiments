class Grid {

  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.notes = [];
    this.noteCellSize = 40;
    this.secondaryEffects = [];
    this.musicInstrument = new MusicInstrument(60, 630);

    // initalise grid structure and state
    for (let x=0; x < this.gridWidth; x += this.noteCellSize){
      this.notes.push([]);
      for (let y=0; y < this.gridHeight; y+=this.noteCellSize){
        this.notes[this.notes.length - 1].push(new Note(createVector(x+this.noteCellSize/2,y+this.noteCellSize/2), this.noteCellSize, 0));
      }
    }
  }

  run(img) {
    this.drawSecondaryEffects();

    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }

  drawSecondaryEffects() {
    for (let i = 0; i < this.secondaryEffects.length; i++) {
      if (this.secondaryEffects[i].state <= 0) {
        this.secondaryEffects.splice(i, 1);
        i--;
      } else {
        this.secondaryEffects[i].draw();
      }
    }
  }

  drawActiveNotes(img){
    // draw active notes
    for (var i=0;i<this.notes.length;i++){
      for (var j=0;j<this.notes[i].length;j++){
        var alpha = this.notes[i][j].state * 200;
        var c1 = color(255,0,0,alpha);
        var c2 = color(0,255,0,alpha);
        var centerColor = lerpColor(c1, c2, map(i, 0, this.notes.length, 0, 1));

        let borderColor = color(255 - red(centerColor), 255 - green(centerColor), 255 - blue(centerColor))

        this.notes[i][j].draw(centerColor, borderColor);
      }
    }
  }

  findActiveNotes(img){
    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteCellSize);
              var j = int(screenY/this.noteCellSize);

              this.notes[i][j].activate();
              this.musicInstrument.play(map(j, 0, this.notes[i].length, 630, 60), map(i, 0, this.notes.length, 0.1, 1));

              if (random() < 0.0002) {
                this.secondaryEffects.push(new SecondaryEffect(this.notes[i][j].pos));
              }
            }
        }
    }
  }
}

class Note {
  constructor(pos, size, state) {
    this.pos = pos;
    this.size = size;
    this.state = state;
  }

  //customized graphics for a note
  draw(centerColor, borderColor) {
    if (this.state > 0) {
      fill(255);
      noStroke();

      fill(centerColor);
      ellipse(this.pos.x, this.pos.y, this.size / 3, this.size / 3);

      noFill();
      stroke(lerpColor(centerColor, borderColor, this.state));
      strokeWeight(5);
      ellipse(this.pos.x, this.pos.y, this.size *  this.state, this.size *  this.state);
    }
    this.state-=0.05;
    this.state=constrain(this.state,0,1);
  } 

  activate() {
    this.state = 1;
  }
}

class SecondaryEffect {
  constructor(pos) {
    this.pos = pos;
    this.state = 1;
    this.startAngle = random(PI);
  }

  //draw secondary effect
  draw() {
    noFill()
    strokeWeight(10);
    stroke(255, 255, 0, this.state * 240);
    push();
      translate(this.pos.x, this.pos.y);
      rotate(this.startAngle + map(this.state, 0, 1, 0, TWO_PI));
      scale(map(this.state, 0, 1, 5, 1));
      triangle(
        0, -20,
        -25, 25,
        25, 25
      );
    pop();

    this.state-=0.05;
  }
}
