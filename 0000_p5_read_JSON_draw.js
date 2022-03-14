
class EntitClass {
  constructor(indir, entit, locut, Atla, ambit, x, y) {
    this.indir=indir;
    this.entit = entit;
    this.locut = locut;
    this.Atla=Atla;
    this.ambit=ambit;
    this.x = x;
    this.y = y;
    this.radius = locut / 2000;
 

    this.over = false;
  }

  rollover(px, py) {
    let d = dist(px, py, this.x, this.y);
    this.over = d < this.radius;
  }

  display() {
    stroke(0);
    strokeWeight(0.8);
    noFill();
    ellipse(this.x, this.y, this.radius, this.radius);
    if (this.over) {
      fill(0);
      textAlign(CENTER);
      text("indirizzo: " + this.indir, this.x, this.y + this.radius + 20);
      text("entit: " + this.entit, this.x, this.y + this.radius + 40);
      text("Atla: " + this.Atla, this.x, this.y + this.radius + 60);
      text("ambit: " + this.ambit, this.x, this.y + this.radius + 80);
      text("locutori stimati: " + this.locut, this.x, this.y + this.radius + 100);
    }
  }
}

let data = {};
let entitObjects = [];

// Put any asynchronous data loading in preload to complete before "setup" is run
function preload() {
  data = loadJSON('data/0001_p5_read_JSON_draw.json');
}

// Convert saved data into Objects
function loadData() {
  let entitData = data['entitObjects'];
  console.log( entitData.length);
  for (let i = 0; i < entitData.length; i++) {
    // Get each object in the array
    let ent = entitData[i];

    let indir = ent['indirizzo'];
    let entit = ent['entit'];
    let locut = ent['locutori stimati'];
    let Atla = ent['Atlante'];
    let ambit = ent['ambito'];
    let position = ent['position'];
    let x = position['x'];
    let y = position['y'];

    // Put object in array
    entitObjects.push(new EntitClass(indir, entit, locut, Atla, ambit, x, y));
  }
}


function setup() {
  createCanvas(900, 500);
  loadData();
}

function draw() {
  background(255);
  textSize(20); 

  for (let i = 0; i < entitObjects.length; i++) {
    entitObjects[i].display();
    entitObjects[i].rollover(mouseX, mouseY);
  }

  textAlign(LEFT);
  fill(0);
  text('cursore sul cerchio per mostrare i dati relativi', 10, height - 10);
}
