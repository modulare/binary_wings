let fr = 30;
let j = 0;
let sequ_count = 0;
let plus_j = 0.0001;
let plus_radnt = 0.0001;
let trasp = 10;

function setup() {
  createCanvas(600, 600);
  background(0);
  let h = height;
  let w = width;
  stroke(155, 250, 255);
  textSize(24);
  textStyle(BOLD);

  frameRate(fr);

}

function draw() {
  background(0, 0, 0, trasp);
  text('click to fade or not', 10, 580);

  push()
  translate(600, 300);
  let radnt = 0;

  sequ_count++;

  //change parameter for the "show"
  sequence();

  j += plus_j;

  let ini = -200;
  for (let stp = ini; stp < 0; stp = stp + 0.2) {

    radnt += plus_radnt;

    let x = stp;
    if (mouseY < width/2) {
      x = stp + stp * sin(radnt);
    }

    if ((j * x) != HALF_PI) {

      //THIS IS THE FUNCTION
      let y = pow(x, 3) * tan(j * x);

      // adjust for canvas
      let x_for_canvas = x * 3;
      let y_for_canvas = y / 100000;


      if (abs(y_for_canvas) < height / 2) {
        //only for the "size of point"
        if (mouseX < width/2) {
          point(x_for_canvas, y_for_canvas);
        } else {
		  if (mouseX < width){
			ellipse(x_for_canvas, y_for_canvas, (mouseX-width/2) / (width/2) * 60);
		  }else{
			  ellipse(x_for_canvas, y_for_canvas, 60);
		  }
        }
      }
    }
  }
  fill(255);
  pop();
}

function sequence() {
  switch (sequ_count) {
    case 400:
      j = -40;
      break;
    case 600:
      j = 3.9;
      break;
    case 800:
      j = 1;
      break;
    case 1000:
      j = 0;
      sequ_count = 0;
      break;
    default:
  }
}

function mousePressed() {
  if (trasp == 10) {
    trasp = 255;
  } else {
    trasp = 10;
  }
}