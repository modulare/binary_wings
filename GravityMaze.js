/* GravityMaze ver.10.2 (rel.1.0) by Claudio Tosti 12 jun 2021 
-------------------------------------------------------------------------
                                                                         
          This version is the first released... but it working                  
          ----------------------------------------------------                     
                                                                                                                       
-the comments are very few and must be translated                        
-the name of functione and variables must be translated                  
-the data of the maze IS NOT contained in a JSON file, but in an...      
                                                                         
 > ...ARRAY OF OBJECTS that contains the 4 possible paths.            < 
 > THIS ARRAY AND INSTRUCTION TO CHANGE THE CODES OF THE MAZE ARE AT  < 
 > THE BOTTOM OF THIS FILE                                            < 
 Next step for me: an interactive editor of maze :-)                     
                                                                         
-------------------------------------------------------------------------
                                                                         
            Mechanism of the game and meaning of the name                
            ---------------------------------------------                
                                                                         
                                                                         
This game schematizes with an axonometric projection, a parallelepiped   
made up of cells, smaller parallelepipeds, arranged on columns, rows and 
levels (planes).                                                         
The planes of the parallelepipeds are displayed spaced apart.            
Inside this parallelepiped there is a sphere that rests on the walls     
of the cells.                                                            
                                            ____                         
If we rotate the parallelepiped (which is a MAZE of walls) around an edge
                                        ___                              
of its support base, the sphere falls by GRAvity in one direction only    
(and of course the support base of the parallelepiped changes).          
The number of direction depends on the number of solid faces of the cell 
                                                                         
IN THIS SCHEMATIZES THE ROTATION IS NOT SEEN, BUT THE DIRECTIONS OF FALL 
ARE INDICATED BY SOME LINES AND THE "SUPPORTING WALL" TURNS GRAY.        
THE LINES START AT THE CURRENT POSITION OF THE SPHERE AND END IN THE     
TARGET CELL.                                                             
                                                                         
                         The goal of the game                            
                         --------------------                            
                                                                         
The "sphere" must be placed in the cell with the green borders           
                                                                         
                             Instruction                                 
                             -----------                                 
                                                                         
-There are 3 types of "red" circles:                                     
 -the small ones indicate the cell ID                                    
 -the "medium" ones indicate the alternatives for moving in the cells    
 -the big one (with a little white circular "reflection") represent the  
  "sphere" that moves between the cells and that must reach the cell with
  the green borders.                                                     
 -Depending on how many walls the cell has, the directions of movement   
  can be multiple. 

  VERY IMPORTANT!!!                                             
  CLICKING MORE TIMES ON THE "SPHERE" YOU CAN SEE ALL THE ALTERNATIVES
  AND ON WHICH WALL THE SPHERE RESTS.
  THE SPHERE ONLY MOVES WHEN YOU CLICK ON THE END OF A RED LINE !                                    
                                                                         
- There is a button to see the ceiling of the cells.                     
                                                                         
-clicking "solution button", the cells of a winning path are indicated   
 with a blue square (they are always indicated)                                                 
 A red square indicates the "gravity traps", those "hatches" where you   
 can fall and you can not get out (they are NOT always indicated)                                       
 This squares are indicated in an array of objects (see at the end of    
 this file)                                                              
                                                                         
-to RESTART the same maze or CHANGE maze click one of the four buttons   
 at the top left   
 
 -to zoom the maze... zoom the page :-)
                                                                         
-------------------------------------------------------------------------


/*
10.2 diecipuntodue: 
  - rel.1.0
*/

class simple_button {
  constructor(x, y, width, height, color, text, textsize) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.defColor = color;
    this.text = text;
    this.textsize = textsize;
  }
  display() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
    fill(0);
    noStroke();
    textSize(this.textsize);
    text(this.text, this.x + 5, this.y + this.height / 2 + 5);
    stroke(0);
  }
  on(x, y) {
    if ((x > this.x) & (x < this.x + this.width)) {
      if ((y > this.y) & (y < this.y + this.height)) {
        return true;
      }
    }
    return false;
  }
}

let arrMaze = []; // array di oggetti contenenti le celle con le pareti (le pareti periferiche sono di default)
let arMazIdx;
let allN3D = [];

let n_colonne = 4;
let n_livelli = 4;
let n_righe = 4;
let lato;
let mazeOrX = 280;
let mazeOrY = 750;

let distanzaFraColonne = 1.89;
let distanzaFraRighe = 1.32;
let fattoreSfasaRighe = 0.9;
let sfasaRighe = lato * fattoreSfasaRighe;
let fattoreAumentaAltezzaPareti = 0.78;
let altP; // stepY * fattoreAumentaAltezzaPareti;
let daltP; //distanzaFralivelli_in_pix - altP;

let facciaDiAppoggioSelezionata = 4;
let facceArray = [];
let facceIndex = -1;

let pos3DN_in_hand = [];
let pos1DN_in_hand;
let codice_totale_in_hand;
let N1D_extreme_in_hand = [];

let pos3DN_selected = [];
let pos2DN_selected = [];
let pos1DN_selected;
let codice_totale_selected;
let N1D_extreme_selected = [];
let contPush = 0;
let N3D_WIN = [];
let WIN = false;

let steP = 0;
let arrBut = [];
let but_solution = new simple_button(
  480,
  860,
  100,
  30,
  [255, 102, 0, 100],
  "solution",
  24
);
let solution = false;
let but_viewCeil = new simple_button(
  10,
  145,
  112,
  30,
  [255, 255, 0, 150],
  "view ceiling",
  20
);
let Ceiling = false;
let fondo;

function setup() {
  pixelDensity(1);
  createCanvas(600, 900);
  fondo = createGraphics(600, 900);
  create_buttons();

  //SET HERE THE DEFAULT MAZE
  //
  let a = arrBut[0];
  //
  //-------------------------

  buttonChoise(a.x + 5, a.y + 5);
  init();

}

function prepare_fondo() {

  if (fondo) {
    fondo.remove();
    fondo = null;
    fondo = createGraphics(600, 900);
  }

  fondo.fill(80, 185);
  fondo.ellipse(mazeOrX, mazeOrY, 15);
  fondo.fill(200, 0, 0);

  for (let livello = 0; livello < n_livelli; livello++) {
    for (let riga = 0; riga < n_righe; riga++) {
      for (let colonna = 0; colonna < n_colonne; colonna++) {
        let N3D = [colonna, riga, livello];
        fondo.strokeWeight(1);
        fondo.stroke(175);
        draw_spigoli_on_fondo(N3D);
        fondo.strokeWeight(3);
        fondo.stroke(0, 185, 0);
        //DISEGNA SPIGOLI CELLA TARGET
        draw_spigoli_on_fondo(N3D_WIN);
      }
    }
  }
  draw_name();
  //DISEGNA TUTTE LE FACCE DEL LABIRINTO
  draw_percorsi();
}

function create_buttons() {
  let wi = 60;
  let he = 33;
  let color = [255, 205, 0];
  let space = 14;
  let x = 10;
  let y = 55;
  let txSize = 22;
  arrBut.push(new simple_button(x, y, wi, he, color, " ", txSize));
  x += wi + space;
  arrBut.push(new simple_button(x, y, wi, he, color, " ", txSize));
  x = 10;
  y = 100;
  arrBut.push(new simple_button(x, y, wi, he, color, " ", txSize));
  x += wi + space;
  arrBut.push(new simple_button(x, y, wi, he, color, " ", txSize));

  let cont = 0;
  while (cont < arrBut.length) {
    let ab = arrBut[cont];
    let testo =
      arrMaze[cont].colonne +
      "." +
      arrMaze[cont].righe +
      "." +
      arrMaze[cont].livelli;
    ab.text = testo;
    cont++;
  }
}

function init() {
  n_colonne = arrMaze[arMazIdx].colonne;
  n_righe = arrMaze[arMazIdx].righe;
  n_livelli = arrMaze[arMazIdx].livelli;
  mazeOrX = arrMaze[arMazIdx].mazeOrX;
  mazeOrY = arrMaze[arMazIdx].mazeOrY;
  lato = arrMaze[arMazIdx].lato;

  solution = false;

  initArray();

  load_allN3D();

  pos3DN_in_hand = N1D_to_N3D(arrMaze[arMazIdx].entrata);
  pos1DN_in_hand = arrMaze[arMazIdx].entrata;

  pos3DN_selected.push(pos3DN_in_hand[0], pos3DN_in_hand[1], pos3DN_in_hand[2]);
  pos1DN_selected = arrMaze[arMazIdx].entrata;

  N3D_WIN = N1D_to_N3D(arrMaze[arMazIdx].uscita);

  Load_N1D_extreme(N1D_extreme_selected, pos3DN_selected);

  facceArray = calcola_codice_totale_della_cella_ARRAY(
    N1D_extreme_selected,
    pos1DN_in_hand
  );

  stepX = cos(PI / 6) * (lato * 2) * distanzaFraColonne;
  stepY = sin(PI / 4) * (lato * 2) * distanzaFraRighe;

  distanzaFralivelli_in_pix = (n_righe + 5) * stepY * 0.6;
  sfasaRighe = lato * fattoreSfasaRighe;

  altP = stepY * fattoreAumentaAltezzaPareti;
  daltP = distanzaFralivelli_in_pix - altP;

  pos2DN_selected = N3D_xyNodoCella(
    pos3DN_selected[0],
    pos3DN_selected[1],
    pos3DN_selected[2]
  );

  freePath(pos3DN_in_hand);

  steP = 0;
  WIN = false;
}

function load_allN3D() {
  for (let colonna = 0; colonna < n_colonne; colonna++) {
    allN3D[colonna] = [];
    for (let riga = 0; riga < n_righe; riga++) {
      allN3D[colonna][riga] = [];
      for (let livello = 0; livello < n_livelli; livello++) {
        allN3D[colonna][riga][livello] = 0;
      }
    }
  }

  for (let j = 0; j < arrMaze[arMazIdx].celle.length; j++) {
    let N3D = N1D_to_N3D(arrMaze[arMazIdx].celle[j][0]); //ap[n_ap].celle[j][ 0 ] => N1D cella
    allN3D[N3D[0]][N3D[1]][N3D[2]] = arrMaze[arMazIdx].celle[j][1]; //ap[n_ap].celle[j][ 1 ] => tipo cella
  }
}

function bit_test_if_is_1(_byte, pos) {
  let map_pos = [1, 2, 4, 8, 16, 32, 64, 128];
  if ((_byte & map_pos[pos]) > 0) {
    return true;
  }
  return false;
}

function draw() {
  background(225, 225, 224);
  // draw_name();
  draw_Maze2D();
  draw_info(pos3DN_in_hand);
  if (WIN == true) {
    textSize(80);
    fill(250, 0, 0);
    strokeWeight(2)
    stroke(0);
    text("YOU WIN !!!", 100, 380);
    strokeWeight(1)
    textSize(24);
  }
  draw_button();
  image(fondo, 0, 0);
  line(0, 86 - 40, 600, 86 - 40);
}

function draw_name() {
  fondo.textSize(60);
  fondo.strokeWeight(1);
  let c = 190;
  fondo.stroke(c, c, c);
  fondo.noFill();
  let x = 545;
  let y = 100;
  fondo.text("G", x, y);
  y += 28;
  fondo.text("R", x, y);
  y += 30;
  fondo.text("A", x, y);
  y += 32;
  fondo.text("V", x, y);
  y += 46;
  fondo.text("I", x + 12, y);
  y += 52;
  fondo.text("T", x, y);
  y += 69;
  fondo.text("Y", x, y);
  y += 83;
  fondo.text("M", x, y);
  y += 106;
  fondo.text("A", x, y);
  y += 129;
  fondo.text("Z", x, y);
  y += 170;
  fondo.text("E", x, y);
  fondo.strokeWeight(1);
}

function draw_button() {
  let cont = 0;
  stroke(0);
  while (cont < arrBut.length) {
    let ab = arrBut[cont];
    ab.display();
    cont++;
  }
  but_solution.display();
  but_viewCeil.display();
}

function draw_Maze2D() {
  fill(80, 185);
  ellipse(mazeOrX, mazeOrY, 15);
  fill(200, 0, 0);
  for (let livello = 0; livello < n_livelli; livello++) {
    for (let riga = 0; riga < n_righe; riga++) {
      for (let colonna = 0; colonna < n_colonne; colonna++) {
        let N3D = [colonna, riga, livello];
        // stroke(175);
        // draw_spigoli(N3D);
        let N2D = N3D_xyNodoCella(colonna, riga, livello);
        // fill(255, 0, 0, 150);
        // ellipse(N2D[0], N2D[1], 10 * zoom);
        if ((abs(mouseX - N2D[0]) < 10) & (abs(mouseY - N2D[1]) < 10)) {
          pos3DN_in_hand = [N3D[0], N3D[1], N3D[2]];
          pos1DN_in_hand = N3D_to_N1D([N3D[0], N3D[1], N3D[2]]);
        }
      }
    }
  }

  strokeWeight(3);
  //DISEGNA IN ROSSO LE LINEE CHE CONGIUNGONO GLI ESTREMI LIBERI, SU DI UNA FACCIA DI APPOGGIO, DI UN NODO SELEZIONATO
  alternative(N1D_extreme_selected, facciaDiAppoggioSelezionata);
  codice_totale_in_hand = calcola_codice_totale_della_cella_NUMERO(N1D_extreme_in_hand, pos1DN_in_hand);
  //DISEGNA IN GRIGIO LA FACCIA DI APPOGGIO, 
  draw_faccia_di_appoggio(pos3DN_selected, facciaDiAppoggioSelezionata)

  stroke(0);
  //DISEGNA SPIGOLI CELLA IN_HAND
  draw_spigoli(pos3DN_in_hand);
  //DISEGNA IN NERO LE LINEE CHE CONGIUNGONO GLI ESTREMI LIBERI DI UN NODO NON SELEZIONATO
  freePath(pos3DN_in_hand);
  draw_sphere();
  stroke(130);
  strokeWeight(3);
  //DISEGNA SPIGOLI CELLA SELEZIONATA
  draw_spigoli(pos3DN_selected);
  strokeWeight(1);
}

function draw_spigoli(N3D) {

  let { a, b, c, d, g, e, f, h } = calcola_vertici(N3D);

  strokeJoin(ROUND);
  noFill();
  beginShape();
  vertex(a[0], a[1]);
  vertex(b[0], b[1]);
  vertex(c[0], c[1]);
  vertex(d[0], d[1]);
  endShape(CLOSE);
  beginShape();
  vertex(a[0], a[1]);
  vertex(d[0], d[1]);
  vertex(g[0], g[1]);
  vertex(e[0], e[1]);
  endShape(CLOSE);
  beginShape();
  vertex(a[0], a[1]);
  vertex(b[0], b[1]);
  vertex(f[0], f[1]);
  vertex(e[0], e[1]);
  endShape(CLOSE);
  beginShape();
  vertex(g[0], g[1]);
  vertex(e[0], e[1]);
  vertex(f[0], f[1]);
  vertex(h[0], h[1]);
  endShape(CLOSE);
  beginShape();
  vertex(a[0], a[1]);
  vertex(d[0], d[1]);
  vertex(g[0], g[1]);
  vertex(e[0], e[1]);
  endShape(CLOSE);
  beginShape();
  vertex(a[0], a[1]);
  vertex(b[0], b[1]);
  vertex(f[0], f[1]);
  vertex(e[0], e[1]);
  endShape(CLOSE);
  beginShape();
  vertex(g[0], g[1]);
  vertex(h[0], h[1]);
  vertex(c[0], c[1]);
  vertex(d[0], d[1]);
  endShape(CLOSE);
}

function draw_spigoli_on_fondo(N3D) {

  let { a, b, c, d, g, e, f, h } = calcola_vertici(N3D);

  fondo.strokeJoin(ROUND);
  fondo.noFill();
  fondo.beginShape();
  fondo.vertex(a[0], a[1]);
  fondo.vertex(b[0], b[1]);
  fondo.vertex(c[0], c[1]);
  fondo.vertex(d[0], d[1]);
  fondo.endShape(CLOSE);
  fondo.beginShape();
  fondo.vertex(a[0], a[1]);
  fondo.vertex(d[0], d[1]);
  fondo.vertex(g[0], g[1]);
  fondo.vertex(e[0], e[1]);
  fondo.endShape(CLOSE);
  fondo.beginShape();
  fondo.vertex(a[0], a[1]);
  fondo.vertex(b[0], b[1]);
  fondo.vertex(f[0], f[1]);
  fondo.vertex(e[0], e[1]);
  fondo.endShape(CLOSE);
  fondo.beginShape();
  fondo.vertex(g[0], g[1]);
  fondo.vertex(e[0], e[1]);
  fondo.vertex(f[0], f[1]);
  fondo.vertex(h[0], h[1]);
  fondo.endShape(CLOSE);
  fondo.beginShape();
  fondo.vertex(a[0], a[1]);
  fondo.vertex(d[0], d[1]);
  fondo.vertex(g[0], g[1]);
  fondo.vertex(e[0], e[1]);
  fondo.endShape(CLOSE);
  fondo.beginShape();
  fondo.vertex(a[0], a[1]);
  fondo.vertex(b[0], b[1]);
  fondo.vertex(f[0], f[1]);
  fondo.vertex(e[0], e[1]);
  fondo.endShape(CLOSE);
  fondo.beginShape();
  fondo.vertex(g[0], g[1]);
  fondo.vertex(h[0], h[1]);
  fondo.vertex(c[0], c[1]);
  fondo.vertex(d[0], d[1]);
  fondo.endShape(CLOSE);

  draw_posID(a, c);
}

function calcola_vertici(N3D) {
  let a = N3D_xyNodoCella(N3D[0], N3D[1], N3D[2]);
  let c = N3D_xyNodoCella(N3D[0] + 1, N3D[1] + 1, N3D[2]);
  let off = [(a[0] - c[0]) / 2, (a[1] - c[1]) / 2];
  let b = N3D_xyNodoCella(N3D[0] + 1, N3D[1], N3D[2]);
  let d = N3D_xyNodoCella(N3D[0], N3D[1] + 1, N3D[2]);
  add_to_coo(a, off);
  add_to_coo(c, off);
  add_to_coo(b, off);
  add_to_coo(d, off);

  let e = [a[0], a[1] - altP];
  let f = [b[0], b[1] - altP];
  let g = [d[0], d[1] - altP];
  let h = [c[0], d[1] - altP];
  return { a, b, c, d, g, e, f, h };
}

function draw_percorsi() {
  for (let j = 0; j < arrMaze[arMazIdx].celle.length; j++) {
    fondo.strokeWeight(1);
    draw_facce(
      N1D_to_N3D(arrMaze[arMazIdx].celle[j][0]),
      arrMaze[arMazIdx].celle[j][1]);
  }
  fondo.strokeJoin(ROUND);

  if (solution) {
    for (let j = 0; j < arrMaze[arMazIdx].solution.length; j++) {
      fondo.stroke(80, 20, 250);
      fondo.strokeWeight(6);
      let { a, b, c, d, g, e, f, h } = calcola_vertici(N1D_to_N3D(arrMaze[arMazIdx].solution[j]));
      let off = [(a[0] - c[0]) / 2 + 6, (a[1] - c[1]) / 2 + 6];
      fondo.rect(a[0] - off[0], a[1] - off[1], 6);
    }

    let N2D = N1D_to_N2D(arrMaze[arMazIdx].solution[0]);
    for (let j = 1; j < arrMaze[arMazIdx].solution.length; j++) {
      fondo.stroke(0, 155, 255);
      fondo.strokeWeight(1);
      let N2D_ = N1D_to_N2D(arrMaze[arMazIdx].solution[j]);
      fondo.line(N2D[0], N2D[1], N2D_[0], N2D_[1],);
      N2D[0] = N2D_[0];
      N2D[1] = N2D_[1];
    }

    for (let j = 0; j < arrMaze[arMazIdx].gravity_trap.length; j++) {
      fondo.stroke(250, 0, 0);
      fondo.strokeWeight(6);
      let { a, b, c, d, g, e, f, h } = calcola_vertici(N1D_to_N3D(arrMaze[arMazIdx].gravity_trap[j]));
      let off = [(a[0] - c[0]) / 2 + 6, (a[1] - c[1]) / 2 + 6];
      fondo.rect(a[0] - off[0], a[1] - off[1], 6);
    }
  }
  fondo.strokeWeight(1);
}

function draw_facce(N3D, tipo) {

  let { a, b, c, d, g, e, f, h } = calcola_vertici(N3D);
  if (a[1] < 50) {
    console.log(a);
  }


  if (bit_test_if_is_1(tipo, 0)) {
    let rosso = [255, 0, 0, 85];
    fondo.fill(rosso);
    fondo.beginShape();
    fondo.vertex(a[0], a[1]);
    fondo.vertex(d[0], d[1]);
    fondo.vertex(g[0], g[1]);
    fondo.vertex(e[0], e[1]);
    fondo.endShape(CLOSE);
  }

  if (bit_test_if_is_1(tipo, 1)) {
    let celeste = [0, 255, 255, 85];
    fondo.fill(celeste);
    fondo.beginShape();
    fondo.vertex(a[0], a[1]);
    fondo.vertex(b[0], b[1]);
    fondo.vertex(f[0], f[1]);
    fondo.vertex(e[0], e[1]);
    fondo.endShape(CLOSE);
  }

  if (bit_test_if_is_1(tipo, 2)) {
    let giallo = [255, 255, 0, 85];
    fondo.fill(giallo);
    fondo.beginShape();
    fondo.vertex(a[0], a[1]);
    fondo.vertex(b[0], b[1]);
    fondo.vertex(c[0], c[1]);
    fondo.vertex(d[0], d[1]);
    fondo.endShape(CLOSE);
    if (Ceiling & (N3D[2] > 0)) {
      //soffitto sottostante
      fondo.beginShape();
      fondo.vertex(a[0], a[1] + daltP);
      fondo.vertex(b[0], b[1] + daltP);
      fondo.vertex(c[0], c[1] + daltP);
      fondo.vertex(d[0], d[1] + daltP);
      fondo.endShape(CLOSE);
    }
  }

  if (bit_test_if_is_1(tipo, 5)) {
    let giallo = [255, 255, 0, 85];
    fondo.fill(giallo);
    fondo.beginShape();
    fondo.vertex(e[0], e[1] - daltP);
    fondo.vertex(f[0], f[1] - daltP);
    fondo.vertex(h[0], h[1] - daltP);
    fondo.vertex(g[0], g[1] - daltP);
    fondo.endShape(CLOSE);

    if (Ceiling & (N3D[2] < n_livelli - 1)) {
      //pavimento soprastante
      fondo.beginShape();
      fondo.vertex(e[0], e[1]);
      fondo.vertex(f[0], f[1]);
      fondo.vertex(h[0], h[1]);
      fondo.vertex(g[0], g[1]);
      fondo.endShape(CLOSE);
    }
  }

  if (N3D[0] < n_colonne - 1) {
    if (bit_test_if_is_1(tipo, 3)) {
      let rosso = [255, 0, 0, 85];
      fondo.fill(rosso);
      fondo.beginShape();
      fondo.vertex(b[0], b[1]);
      fondo.vertex(c[0], c[1]);
      fondo.vertex(h[0], h[1]);
      fondo.vertex(f[0], f[1]);
      fondo.endShape(CLOSE);
    }
  }
  if (N3D[1] < n_righe - 1) {
    if (bit_test_if_is_1(tipo, 4)) {
      let celeste = [0, 255, 255, 85];
      fondo.fill(celeste);
      fondo.beginShape();
      fondo.vertex(d[0], d[1]);
      fondo.vertex(c[0], c[1]);
      fondo.vertex(h[0], h[1]);
      fondo.vertex(g[0], g[1]);
      fondo.endShape(CLOSE);
    }
  }
  if (bit_test_if_is_1(tipo, 5)) {
    let giallo = [255, 255, 0, 85];
    fondo.fill(giallo);
    fondo.beginShape();
    fondo.vertex(e[0], e[1]);
    fondo.vertex(f[0], f[1]);
    fondo.vertex(h[0], h[1]);
    fondo.vertex(g[0], g[1]);
    fondo.endShape(CLOSE);
  }

  draw_posID(a, c);

  return { a, b };
}

function draw_posID(a, c) {
  let off = [(a[0] - c[0]) / 2, (a[1] - c[1]) / 2];
  fondo.fill(255, 0, 0);
  fondo.strokeWeight(1);
  fondo.ellipse(a[0] - off[0], a[1] - off[1], 6);
}

function draw_faccia_di_appoggio(N3D, tipo) {

  let { a, b, c, d, g, e, f, h } = calcola_vertici(N3D);

  stroke(0);
  strokeWeight(6);
  fill(160);

  if (bit_test_if_is_1(tipo, 0)) {
    beginShape();
    vertex(a[0], a[1]);
    vertex(d[0], d[1]);
    vertex(g[0], g[1]);
    vertex(e[0], e[1]);
    endShape(CLOSE);
  }

  if (bit_test_if_is_1(tipo, 1)) {
    beginShape();
    vertex(a[0], a[1]);
    vertex(b[0], b[1]);
    vertex(f[0], f[1]);
    vertex(e[0], e[1]);
    endShape(CLOSE);
  }

  if (bit_test_if_is_1(tipo, 2)) {
    beginShape();
    vertex(a[0], a[1]);
    vertex(b[0], b[1]);
    vertex(c[0], c[1]);
    vertex(d[0], d[1]);
    endShape(CLOSE);
  }

  if (bit_test_if_is_1(tipo, 3)) {
    beginShape();
    vertex(b[0], b[1]);
    vertex(c[0], c[1]);
    vertex(h[0], h[1]);
    vertex(f[0], f[1]);
    endShape(CLOSE);
  }

  if (bit_test_if_is_1(tipo, 4)) {
    beginShape();
    vertex(d[0], d[1]);
    vertex(c[0], c[1]);
    vertex(h[0], h[1]);
    vertex(g[0], g[1]);
    endShape(CLOSE);
  }

  if (bit_test_if_is_1(tipo, 5)) {
    beginShape();
    vertex(e[0], e[1]);
    vertex(f[0], f[1]);
    vertex(h[0], h[1]);
    vertex(g[0], g[1]);
    endShape(CLOSE);
  }

  strokeWeight(3);
}

function draw_info(N3D) {
  fill(255);
  // rect(10, 53, 130, 85);
  rect(10, 10, 473, 33);
  rect(490, 10, 103, 33);
  fill(0);
  textSize(24);

  if (N3D[0] == -1 || N3D[0] > n_colonne - 1) {
    return;
  }
  noStroke()
  text("cell info:  ID = ", 15, 35);
  codice_totale_in_hand = calcola_codice_totale_della_cella_NUMERO(N1D_extreme_in_hand, pos1DN_in_hand);
  text("Code = ", 210, 35);
  fill(255, 0, 0);
  stroke(0)
  text(N3D_to_N1D(N3D), 168, 35);
  text(codice_totale_in_hand, 296, 35);
  noStroke()
  fill(0);
  textSize(20);
  text("step: " + steP, 495, 33);
  textSize(18);

  text(" col " + N3D[0] + "  row " + N3D[1] + "  lev " + N3D[2], 330, 33);

}

function calcola_codice_totale_della_cella_NUMERO(N1D_extreme, pos1DN) {
  let facce = 0;
  for (let k = 0; k < N1D_extreme.length; k++) {
    if (N1D_extreme[k][0] == pos1DN) {
      facce += 2 ** k;
    };
    if (N1D_extreme[k][1] == pos1DN) {
      facce += 2 ** (k + 3);
    };
  }
  return facce;
}


function draw_extreme(array_extreme, index, sz) {
  let N2D = N1D_to_N2D(array_extreme[index][0]);
  let N2D_ = N1D_to_N2D(array_extreme[index][1]);
  fill(255, 0, 255, 150);
  ellipse(N2D[0], N2D[1], sz);
  ellipse(N2D_[0], N2D_[1], sz);
  // strokeWeight(2);
  line(N2D[0], N2D[1], N2D_[0], N2D_[1]);
}

function draw_sphere() {
  fill(255, 100, 100);
  ellipse(pos2DN_selected[0], pos2DN_selected[1], lato * 1.8);
  stroke(0);
  fill(255);
  let latoterz = lato / 3.33;
  ellipse(
    pos2DN_selected[0] - latoterz,
    pos2DN_selected[1] - latoterz,
    latoterz
  );
}

function alternative(N1D_ext, _facciaDiAppoggioSelezionata) {
  stroke(255, 0, 0);
  switch (_facciaDiAppoggioSelezionata) {
    case 0:
      stroke(0);
      draw_extreme(N1D_ext, 0, 3);
      draw_extreme(N1D_ext, 1, 3);
      draw_extreme(N1D_ext, 2, 3);
      noDirection = -1;
      break;
    case 1:
    case 8:
      draw_extreme(N1D_ext, 1, 15);
      draw_extreme(N1D_ext, 2, 15);
      noDirection = 0;
      break;
    case 2:
    case 16:
      draw_extreme(N1D_ext, 0, 15);
      draw_extreme(N1D_ext, 2, 15);
      noDirection = 1;
      break;
    case 4:
    case 32:
      draw_extreme(N1D_ext, 0, 15);
      draw_extreme(N1D_ext, 1, 15);
      noDirection = 2;
      break;
    default:
      break;
  }
}

function noDirectionFix(_facciaDiAppoggioSelezionata) {
  let noDirection = -1;
  switch (_facciaDiAppoggioSelezionata) {
    case 1:
    case 8:
      noDirection = 0;
      break;
    case 2:
    case 16:
      noDirection = 1;
      break;
    case 4:
    case 32:
      noDirection = 2;
      break;
    default:
      break;
  }
  return noDirection;
}

function freePath(N3D) {
  if (pos1DN_in_hand != pos1DN_selected) {
    clearArray(N1D_extreme_in_hand);
    Load_N1D_extreme(N1D_extreme_in_hand, N3D);
    strokeWeight(1);
    alternative(N1D_extreme_in_hand, 0);
  }
}

function Load_N1D_extreme(array_extreme, N3D) {
  array_extreme.push(pathColonne(N3D));
  array_extreme.push(pathRighe(N3D));
  array_extreme.push(pathlivelli(N3D));
}

function calcola_codice_totale_della_cella_ARRAY(N1D_extreme, pos1DN) {
  let arrayFacce = [];

  for (let k = 0; k < 3; k++) {
    if (N1D_extreme[k][0] == pos1DN) {
      arrayFacce.push(2 ** k);
    }
    if (N1D_extreme[k][1] == pos1DN) {
      arrayFacce.push(2 ** (k + 3));
    }
  }
  return arrayFacce;
}

function is_On_N1D_extreme_selected() {
  let noDirection = noDirectionFix(facciaDiAppoggioSelezionata);
  let is_On = false;
  for (let k = 0; k < 3; k++) {
    if (k != noDirection) {
      if (N1D_extreme_selected[k][0] == pos1DN_in_hand) {
        is_On = true;
        return is_On;
      }
      if (N1D_extreme_selected[k][1] == pos1DN_in_hand) {
        is_On = true;
        return is_On;
      }
    }
  }
  return is_On;
}

function pathColonne(N3D) {
  //
  //ferma la palla sulle pareti (rosse) fra le colonne: 1 oppure 8
  //
  let N1D_extreme = [0, 0];
  for (k = N3D[0]; k > -1; k--) {
    if (bit_test_if_is_1(allN3D[k][N3D[1]][N3D[2]], 3) & (k != N3D[0])) {
      // ESCE DAL FOR PERCHE':...muovendosi per COlonna DEcrescente, NON può accedere alla cella perchè questa ha la parete a "destra"
      break;
    }
    N1D_extreme[0] = N3D_to_N1D([k, N3D[1], N3D[2]]);
    if (bit_test_if_is_1(allN3D[k][N3D[1]][N3D[2]], 0)) {
      // ESCE DAL FOR PERCHE':...muovendosi per COlonna DEcrescente ha potuto accedere ma è l'ultima cella libera perchè questa ha la parete a "sinistra"
      break;
    }
  }
  for (k = N3D[0]; k < n_colonne; k++) {
    if (bit_test_if_is_1(allN3D[k][N3D[1]][N3D[2]], 0) & (k != N3D[0])) {
      // ESCE DAL FOR PERCHE':...muovendosi per COlonna crescente, NON può accedere alla cella perchè questa ha la parete a "sinistra"
      break;
    }
    N1D_extreme[1] = N3D_to_N1D([k, N3D[1], N3D[2]]);
    if (bit_test_if_is_1(allN3D[k][N3D[1]][N3D[2]], 3)) {
      // ESCE DAL FOR PERCHE':...muovendosi per COlonna crescente ha potuto accedere ma è l'ultima cella libera perchè questa ha la parete a "destra"
      break;
    }
  }
  return N1D_extreme;
}

function pathRighe(N3D) {
  //
  //ferma la palla sulle pareti (celesti) fra le righe: 2 oppure 16
  //
  let N1D_extreme = [0, 0];
  for (k = N3D[1]; k > -1; k--) {
    if (bit_test_if_is_1(allN3D[N3D[0]][k][N3D[2]], 4) & (k != N3D[1])) {
      // ESCE DAL FOR PERCHE':...muovendosi per RIga DEcrescente, NON può accedere alla cella perchè questa ha la parete "frontale"
      break;
    }
    N1D_extreme[0] = N3D_to_N1D([N3D[0], k, N3D[2]]);
    fill(255, 0, 255, 150);
    if (bit_test_if_is_1(allN3D[N3D[0]][k][N3D[2]], 1)) {
      // ESCE DAL FOR PERCHE':...muovendosi per RIga DEcrescente ha potuto accedere ma è l'ultima cella libera perchè questa ha la parete "in fondo"
      break;
    }
  }
  for (k = N3D[1]; k < n_righe; k++) {
    if (bit_test_if_is_1(allN3D[N3D[0]][k][N3D[2]], 1) & (k != N3D[1])) {
      // ESCE DAL FOR PERCHE':...muovendosi per RIga crescente, NON può accedere alla cella perchè questa ha la parete "in fondo"
      break;
    }
    N1D_extreme[1] = N3D_to_N1D([N3D[0], k, N3D[2]]);
    if (bit_test_if_is_1(allN3D[N3D[0]][k][N3D[2]], 4)) {
      // ESCE DAL FOR PERCHE':...muovendosi per RIga crescente ha potuto accedere ma è l'ultima cella libera perchè questa ha la parete "frontale"
      break;
    }
  }
  return N1D_extreme;
}

function pathlivelli(N3D) {
  let N1D_extreme = [0, 0];
  for (k = N3D[2]; k > -1; k--) {
    if (bit_test_if_is_1(allN3D[N3D[0]][N3D[1]][k], 5) & (k != N3D[2])) {
      // ESCE DAL FOR PERCHE':...muovendosi per livello DEcrescente, NON può accedere alla cella perchè questa ha "il soffitto"
      break;
    }
    N1D_extreme[0] = N3D_to_N1D([N3D[0], N3D[1], k]);
    if (bit_test_if_is_1(allN3D[N3D[0]][N3D[1]][k], 2)) {
      // ESCE DAL FOR PERCHE':...muovendosi per livello DEcrescente ha potuto accedere ma è l'ultima cella libera perchè questa ha "il pavimento"
      break;
    }
  }
  for (k = N3D[2]; k < n_livelli; k++) {
    if (bit_test_if_is_1(allN3D[N3D[0]][N3D[1]][k], 2) & (k != N3D[2])) {
      // ESCE DAL FOR PERCHE':...muovendosi per livello crescente, NON può accedere alla cella perchè questa ha "il pavimento"
      break;
    }
    N1D_extreme[1] = N3D_to_N1D([N3D[0], N3D[1], k]);
    if (bit_test_if_is_1(allN3D[N3D[0]][N3D[1]][k], 5)) {
      // ESCE DAL FOR PERCHE':...muovendosi per livello crescente ha potuto accedere ma è l'ultima cella libera perchè questa ha "il soffitto"
      break;
    }
  }
  return N1D_extreme;
}

function N1D_to_N2D(N1D) {
  let N3D = N1D_to_N3D(N1D);
  let N2D = N3D_xyNodoCella(N3D[0], N3D[1], N3D[2]);
  return [N2D[0], N2D[1]];
}

function N1D_to_N3D(N1D) {
  let livello = int(N1D / (n_colonne * n_righe));
  let nodi_livelli_precedenti = n_colonne * n_righe * livello;
  let colonna = (N1D - nodi_livelli_precedenti) % n_colonne;
  let riga = int((N1D - nodi_livelli_precedenti) / n_colonne);
  return [colonna, riga, livello];
}

function N3D_to_N1D(N3D) {
  return N3D[0] + N3D[1] * n_colonne + N3D[2] * n_colonne * n_righe;
}

function N3D_xyNodoCella(co, ri, pi) {
  return [
    mazeOrX - (stepX - sfasaRighe) * ri + stepX * co,
    mazeOrY - distanzaFralivelli_in_pix * pi + stepY * ri,
  ];
}

function add_to_coo(coo, off) {
  coo[0] += off[0];
  coo[1] += off[1];
}

function initArray() {

  if (allN3D.length > 0) {
    clearArray(allN3D);
  }
  if (pos3DN_in_hand.length > 0) {
    clearArray(pos3DN_in_hand);
  }
  if (pos3DN_selected.length > 0) {
    clearArray(pos3DN_selected);
  }
  if (N3D_WIN.length > 0) {
    clearArray(N3D_WIN);
  }
  if (N1D_extreme_in_hand.length > 0) {
    clearArray(N1D_extreme_in_hand);
  }
  if (N1D_extreme_selected.length > 0) {
    clearArray(N1D_extreme_selected);
  }
  if (pos2DN_selected.length > 0) {
    clearArray(pos2DN_selected);
  }
  if (facceArray.length > 0) {
    clearArray(facceArray);
  }
}

function clearArray(array) {
  // allN3D = []  allN3D.length = 0 ... 
  //I don't understand if it's really the same thing of this...
  while (array.length) {
    array.pop();
  }
}

function mouseClicked() {
  buttonChoise(mouseX, mouseY);
  if (but_solution.on(mouseX, mouseY)) {
    solution = !solution;
    for (let k = 0; k < 100; k++) {
      prepare_fondo();
    }

    return;
  }
  if (but_viewCeil.on(mouseX, mouseY)) {
    Ceiling = !Ceiling;
    if (Ceiling) {
      but_viewCeil.text = "hide ceiling";
    } else {
      but_viewCeil.text = "view ceiling";
    }
    prepare_fondo();
    return;
  }

  if (pos1DN_in_hand == pos1DN_selected) {//CLICCATO SUL GIA' SELEZIONATO
    facceIndex++;
    facceIndex = facceIndex % facceArray.length;
    facciaDiAppoggioSelezionata = facceArray[facceIndex];
  } else {
    if (is_On_N1D_extreme_selected()) {//CLICCATO SU UNO DEGLI GLI ESTREMI DEL GIA' SELEZIONATO
      crea_nodo_selezionato();
    }
  }
}

function crea_nodo_selezionato() {
  clearArray(pos3DN_selected); //PULISCE E CREA NUOVA SELEZIONE
  steP++;
  facceIndex = -1;
  facciaDiAppoggioSelezionata = 0;
  pos3DN_selected.push(
    pos3DN_in_hand[0],
    pos3DN_in_hand[1],
    pos3DN_in_hand[2]
  );
  clearArray(N1D_extreme_selected);
  Load_N1D_extreme(N1D_extreme_selected, pos3DN_selected);
  pos2DN_selected = N3D_xyNodoCella(
    pos3DN_selected[0],
    pos3DN_selected[1],
    pos3DN_selected[2]
  );
  pos1DN_selected = pos1DN_in_hand;
  if (arrMaze[arMazIdx].uscita == pos1DN_selected) {
    WIN = true;
  }
  clearArray(facceArray);
  facceArray = calcola_codice_totale_della_cella_ARRAY(
    N1D_extreme_selected,
    pos1DN_in_hand
  );
  facceIndex++;
  facceIndex = facceIndex % facceArray.length;
  facciaDiAppoggioSelezionata = facceArray[facceIndex];
}

function buttonChoise(x, y) {
  let cont = 0;
  let found = false;
  let index = -1;
  while (cont < arrBut.length) {
    let ab = arrBut[cont];
    if (ab.on(x, y)) {
      found = true;
      index = cont;
    }
    cont++;
  }
  if (found) {
    let k = 0;
    while (k < arrBut.length) {
      let ab = arrBut[k];
      if (k == index) {
        ab.color = [20, 20, 20, 20];
        arMazIdx = index;
        init();
        prepare_fondo();
      } else {
        ab.color = ab.defColor;
      }
      k++;
    }
  }
}


//info -> arMazIdx = 0
arrMaze.push({
  colonne: 3,
  righe: 3,
  livelli: 3,
  entrata: 12,
  uscita: 24,
  lato: 28,
  mazeOrX: 260,
  mazeOrY: 720,
  celle: [
    [3, 24],
    [5, 26],
    [9, 20],
    [10, 4],
    [11, 20],
    [12, 4],
    [13, 8],
    [15, 4],
    [16, 9],
    [17, 4],
    [19, 5],
    [20, 4],
    [21, 14],
    [22, 4],
    [23, 5],
    [24, 6],
    [25, 20],
    [26, 1]
  ],
  solution:
    [13, 4, 5, 14, 17, 26, 20, 19, 25],
  gravity_trap:
    [1, 7]
});
//info -> arMazIdx = 1
arrMaze.push({
  colonne: 4,
  righe: 4,
  livelli: 4,
  entrata: 42,
  uscita: 54,
  lato: 20,
  mazeOrX: 288,
  mazeOrY: 720,
  celle: [
    [0, 8],
    [2, 24],
    [9, 3],
    [10, 9],
    [15, 2],
    [17, 17],
    [21, 12],
    [22, 18],
    [29, 13],
    [32, 8],
    [35, 20],
    [37, 28],
    [39, 16],
    [41, 4],
    [42, 4],
    [49, 4],
    [50, 8],
    [52, 4],
    [53, 4],
    [54, 5],
    [55, 16],
    [61, 5]
  ],
  solution:
    [46, 14, 6, 38, 39, 55],
  gravity_trap:
    []
});
//info -> arMazIdx = 2
arrMaze.push({
  colonne: 5,
  righe: 5,
  livelli: 4,
  entrata: 62,
  uscita: 41,
  lato: 17,
  mazeOrX: 260,
  mazeOrY: 730,
  celle: [
    [6, 1],
    [13, 2],
    [31, 2],
    [28, 4],
    [38, 16],
    [41, 20],
    [53, 8],
    [56, 4],
    [58, 16],
    [62, 4],
    [67, 16],
    [81, 2],
    [83, 8],
    [86, 1],
    [93, 18],
  ],
  solution:
    [52, 53, 28, 38, 39, 89, 86, 81, 83, 8, 6, 31],
  gravity_trap:
    [60, 64, 67]
});
//info -> arMazIdx = 3
arrMaze.push({
  colonne: 7,
  righe: 5,
  livelli: 6,
  entrata: 52,
  uscita: 86,
  lato: 12,
  mazeOrX: 274,
  mazeOrY: 770,
  celle: [
    [12, 1],
    [22, 16],
    [52, 4],
    [57, 1],
    [59, 16],
    [74, 4],
    [86, 1],
    [88, 16],
    [113, 2],
    [117, 8],
    [127, 16],
    [141, 1],
    [144, 1],
    [146, 1],
    [162, 4],
    [177, 13],
    [179, 1],
    [181, 1],
    [182, 21],
    [187, 22],
    [200, 18],
    [202, 26],
    [204, 6],
    [205, 8],
    [208, 4],
    [209, 8]
  ],
  solution:
    [59, 57, 127, 113, 117, 12, 33, 173, 145, 180, 179, 74, 88],
  gravity_trap:
    []
});



/*

EXAMPLE OF A MAZE CONTAINED IN arrMaze[]
(cells with at least one solid face must be written)
===========================================================

//info -> arMazIdx = 0
arrMaze.push({
  colonne: 3,
  righe: 3,
  livelli: 3,
  entrata: 12,
  uscita: 24,
  lato: 30,
  mazeOrX: 280,
  mazeOrY: 720,
  celle: [
    [3, 24],
    [5, 26],   ===> 5 is ID and 26 is the cell Code
    ...        ===> WARNING! THE CELL CODE MUST BE UNIQUE ! :
    ...            [7, 4],  THIS IS A
    ...            [7, 8],  MISTAKE !!!
    ...            [7, 12], THIS IS OK !
    [25, 20],
    [26, 1]
  ],
  solution:
    [12, 4, 5, ...],  ===> cells ID only (they are always indicated)
  gravity_trap:
    [1, 7]   ===> cells ID only (they are NOT always indicated)
});


Cells have two attributes: ID and Code
======================================

  ID is a progressive number  from  0  to  colonne * righe * livelli - 1
  and start from the origin to the top right corner on the front faces
  (you can read the ID value by hovering the mouse in the small circles
   that are inside each cell)

  Code indicates which faces (floor, ceiling, walls) the cell has


the rear faces of the      the front faces of the
cell and their Code        cell and their Code

      +----------+             +----------+
     /|          |            /          /|
    / |          |           /    32    / | NEVER INSERT CODE 32 (ceiling)!!! :
   /  |    2     |          /          /  | IS AUTOMATIC CALCULATE
  +   |          |         +-----last cell|
  | 1 |          |         |          | 8 |
  | origin-------+         |          |   +
  |  /          /          |    16    |  /
  | /    4     /           |          | /
  |/          /            |          |/
  +----------+             +----------+

  if you want a cell whith:
   floor (NEVER CEILING !), the Code is                      4 = 4
   left wall and right wall, the Code is                 1 + 8 = 9
   front wall, left wall, rear wall, the Code is    16 + 1 + 2 = 19
   and so on...(64 possibilities = 6 bit of Code)

WARNING:
-The code inserted in the array CAN BE DIFFERENT from the code indicated
 by the program in the information window above,
 this is because the program automatically adds the unmarked cell walls
 (such as the neighboring ones or those located on the faces of the
 parallelepiped)


Set maze "n" of default ("n" from 0 to 7):
=============================================

  function setup() {
    ...
    let a = arrBut[n];
    ...
  }

*/