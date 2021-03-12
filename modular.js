let marg = 100;
let num_boulder = 25;
let view_range_body_on_edges = true;
let transparency = 25;

function setup() {
    createCanvas(600, 600);
    let orX = width / 2;
    let orY = height / 2;
    this.bldrs = [];

    for (let i = 0; i < num_boulder; i++) {
        let kind = 1;
        let vX = random(-1, 1);
        let vY = random(-1, 1);
        let rot = random(-0.8, 0.8);
        this.bldrs.push(new boulder(i.toString(), orX, orY, new body(kind), createVector(vX, vY), rot));
    }
}

function draw() {
    background(255, 255, 255, transparency);

    sequence();

    noFill();
    stroke(0);
    rect(marg, marg, width - 2 * marg, height - 2 * marg);
}

function sequence() {
 
    if (frameCount == 1) {
        //single body (of first boulder) to show the quadruplication of body on the corner edges
        //with draw the range of rotation and maximum margin out of the edges
        fill(0);
        rect(0,0,width,height);
        noFill();
        marg = 150;
        start_ = 0;
        end_ = 1;
        view_range_body_on_edges = true;

        let kind = 1;
        this.bldrs[0].bod.kind = kind;
        this.bldrs[0].bod.set_range_(kind);
        this.bldrs[0].range_ = this.bldrs[0].bod.range_;
        this.bldrs[0].vel_rot = 1;
        this.bldrs[0].vel.x = 1;
        this.bldrs[0].vel.y = 1;
    }

    if (frameCount == 300) {
        //change direction to show the duplication of body on the opposite edges
        this.bldrs[0].vel.x = 0.5;
        this.bldrs[0].vel.y = 1.5;
    }

    if (frameCount == 1000) {
        //"explosion" of all kinds of bodies with the range of rotation
        //reduction of the margin out of the edges
        marg = 60;
        start_ = 0;
        end_ = num_boulder;
        //reset the first boulder
        this.bldrs[0].x = width / 2;
        this.bldrs[0].y = height / 2;
        this.bldrs[0].vel.x = random(-1, 1);
        this.bldrs[0].vel.y = random(-1, 1);
        for (let i = start_; i < end_; i++) {
            let kind = ceil(random(-1, 2));
            this.bldrs[i].bod.kind = kind;
            this.bldrs[i].bod.set_range_(kind);
            this.bldrs[i].range_ = this.bldrs[i].bod.range_;
        }
    }

    if (frameCount == 1800) {
        //without draw the range of rotation
        view_range_body_on_edges = false;
    }

    if (frameCount == 2500) {
        //only one kind whithout margin
        fill(0);
        rect(0,0,width,height);
        noFill();
        transparency = 5;
        marg = 0;
        start_ = 0;
        end_ = num_boulder;
        for (let i = start_; i < end_; i++) {
            this.bldrs[i].vel.x = random(-1, 1);
            this.bldrs[i].vel.y = random(-1, 1);
            this.bldrs[i].x = width / 2;
            this.bldrs[i].y = height / 2;
            this.bldrs[i].bod.kind = 2;
            this.bldrs[i].bod.set_range_(2);
            this.bldrs[i].rot = random(0.6, 0.9);
            this.bldrs[i].range_ = this.bldrs[i].bod.range_;
        }
    }

    draw_boulders(start_, end_);

}

function draw_boulders(start_, end_) {
    //draw the boulders (on the edges too)
    for (let i = start_; i < end_; i++) {
        bldrs[i].move();
        bldrs[i].display();
        bldrs[i].edges();
    }
}

class boulder {

    constructor(name, x, y, bod, vel, vel_rot) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.rot = vel_rot;
        this.vel_rot = vel_rot;
        this.bod = bod;
        this.range_ = bod.range_;
        this.vel = vel;
        //to determine if this.onedges is true or false 
        //at the beginning
        this.edges();
    }

    move() {
      //move the main body
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.rot += this.vel_rot;
    }
  
    display() {
      //draw the main body
      this.bod.display(this.x,this.y,this.rot);
    }

    edges() {
        //duplicate or quadruplicate the main body that cross the edges
        let k = 0;
        this.onedges = true;
        if (this.y - this.range_ / 2 < marg) {
            if (this.y < marg - this.range_ / 2) {
                this.y = height - marg - this.range_ / 2;
            }
            k = 1;
            this.bod.display(this.x, this.y + (height - 2 * marg), this.rot);
            this.displayRange(this.x, this.y + (height - 2 * marg));
        }
        if (this.y + this.range_ / 2 > height - marg) {
            if (this.y > height - marg + this.range_ / 2) {
                this.y = marg + this.range_ / 2;
            }
            k += 3;
            this.bod.display(this.x, this.y - (height - 2 * marg), this.rot);
            this.displayRange(this.x, this.y - (height - 2 * marg));
        }
        if (this.x - this.range_ / 2 < marg) {
            if (this.x < marg - this.range_ / 2) {
                this.x = width - marg - this.range_ / 2;
            }
            k += 50;
            this.bod.display(this.x + (width - 2 * marg), this.y, this.rot);
            this.displayRange(this.x + (width - 2 * marg), this.y);
        }
        if (this.x + this.range_ / 2 > width - marg) {
            if (this.x > width - marg + this.range_ / 2) {
                this.x = marg + this.range_ / 2;
            }
            k += 70;
            this.bod.display(this.x - (width - 2 * marg), this.y, this.rot);
            this.displayRange(this.x - (width - 2 * marg), this.y);
        }
        switch (k) {
            case 71:
                this.bod.display(this.x - (width - 2 * marg), this.y + (height - 2 * marg), this.rot);
                this.displayRange(this.x - (width - 2 * marg), this.y + (height - 2 * marg));
                break;
            case 73:
                this.bod.display(this.x - (width - 2 * marg), this.y - (height - 2 * marg), this.rot);
                this.displayRange(this.x - (width - 2 * marg), this.y - (height - 2 * marg));
                break;
            case 51:
                this.bod.display(this.x + (width - 2 * marg), this.y + (height - 2 * marg), this.rot);
                this.displayRange(this.x + (width - 2 * marg), this.y + (height - 2 * marg));
                break;
            case 53:
                this.bod.display(this.x + (width - 2 * marg), this.y - (height - 2 * marg), this.rot)
                this.displayRange(this.x + (width - 2 * marg), this.y - (height - 2 * marg));
                break;
            default:
                this.onedges = false;
        }
    }

    displayRange(x, y) {
        if (view_range_body_on_edges == true) {
            stroke(255,0,0);
            line(x - 6, y, x + 6, y);
            line(x, y - 6, x, y + 6);
            rect(x - this.bod.range_ / 2, y - this.bod.range_ / 2, this.range_);
            stroke(0);
        }
    }
}

class body {
    constructor(kind) {
        this.kind = kind;
        this.r = random(0, 255);
        this.g = random(0, 255);
        this.b = random(0, 255);
        this.set_range_(kind);
        this.rot = 0.8;
    }

    set_range_(kind) {
        //consider the size (encumbrance) of the body in a complete rotation
        switch (kind) {
            case 0:
                this.range_ = 100;
                break;
            case 1:
                this.range_ = 200;
                break;
            case 2:
                this.range_ = 141;
                break;
            default:
            //
        }
    }

    display(x, y, rot) {
        switch (this.kind) {
            case 0:
                noStroke();
                push();
                translate(x, y);
                fill(this.r, this.g, this.b, 100);
                ellipse(0, 0, 100);
                fill(this.b, this.r, this.g, 100);
                ellipse(0, 0, 16);
                pop();
                stroke(0);
                break;
            case 1:
                stroke(this.r, this.g, this.b);
                push();
                translate(x, y);
                rotate(radians(rot));
                beginShape();
                vertex(-32, 28);
                vertex(-17, -17);
                vertex(28, -32);
                vertex(-17, -47);
                vertex(-32, -92);
                vertex(-47, -47);
                vertex(-92, -32);
                vertex(-47, -17);
                endShape(CLOSE);
                pop();
                break;
            case 2:
                stroke(1);
                push();
                translate(x, y);
                rotate(radians(rot));
                beginShape();
                vertex(-12, -2);
                vertex(13, -7);
                vertex(33, 23);
                vertex(3, 38);
                endShape(CLOSE);
                rect(-50, -50, 100, 100)
                pop();
                break;
            default:
        }
    }
}
