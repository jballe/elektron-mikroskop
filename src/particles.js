import * as d3 from "d3";
const svg = document.querySelector("svg");

const types = {
  typeA: {
    fill: "url(#typeA)",
    href: '/assets/type-a.png',
    type: 'circle',
    r: 30,
    velocity: 3,
  },
  typeB: {
    fill: "url(#typeB)",
    href: '/assets/type-b.png',
    type: 'circle',
    r: 30,
    velocity: 3,
  },
};
const definitions = {
  skurk1: {
    typeA: 3,
    typeB: 2
  },
};

const data = {
  items: [],
  running: false,
  svg: null,
};

export function renderParticles() {
  initialize();
  renderDefinition("skurk1");
  startStop();
}

function renderDefinition(definitionId) {
  const def = definitions[definitionId];
  if (!def) return;

  const maxX = svg.clientWidth;
  const maxY = svg.clientHeight;

  for (const type of Object.keys(def)) {
    for (let counter = 0; counter < def[type]; counter++) {
      const typeDef = types[type];

      const startX = Math.floor(Math.random() * maxX);
      const startY = Math.floor(Math.random() * maxY);
      const angle = Math.floor(Math.random() * 359);
      let velocity = (Math.random() - 0.5) * 2 * typeDef.velocity;
      if(velocity === 0) velocity = 0.1;
      const id = `${type}_${counter}`;
      console.log(
        `Creating ${id} starting at (${startX},${startY}) with angle ${angle}...`
      );
      data.items.push(new Ball(data.svg, startX, startY, id, angle, typeDef, velocity));
    }
  }
}

function initialize() {
  const width = svg.clientWidth;
  const height = svg.clientHeight;
  data.svg = d3
    .select(svg)
    .append("g")
    .attr("id", "topgroup")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none");
}

export function startStop() {
  if (data.running) {
    data.running = false;
    return;
  }

  data.running = true;
  d3.timer(loop, 500);

  //data.nodes = data.svg.selectAll('.ball')
  //data.force = d3.layout.force().charge(0).size([width,height]).on('tick', tick);

}

function loop() {
    for (var i = 0; i < data.items.length; ++i) {
        var r = data.items[i].Move();
        for (var j = i + 1; j < data.items.length; ++j) {
            ProcessCollision(i, j);
        }
    }
    return data.running
}




// From http://bl.ocks.org/atul-github/0019158da5d2f8499f7f
function Ball(svg, cx, cy, id, angleOfAttack, type, velocity) {
  this.typeDef = type;
  this.x = cx;
  this.y = cy;
  this.svg = svg;
  this.id = id;
  this.aoa = angleOfAttack || Math.PI / 7;
  this.radius = type.r;
  this.weight = type.r;
  this.color = type.fill;

  this.data = [this.id]; // allow us to use d3.enter()
  const thisobj = this;

  // **** aoa is used only here -- earlier I was using to next move position.
  // Now aoa and speed together is velocity
  this.vx = Math.cos(thisobj.aoa) * thisobj.jumpSize; // velocity x
  this.vy = Math.sin(thisobj.aoa) * thisobj.jumpSize; // velocity y
  this.initialVx = this.vx;
  this.initialVy = this.vy;
  this.initialx = this.x;
  this.initialy = this.y;

  // when speed changes, go to initial setting
  this.GoToInitialSettings = function (velocity) {
    thisobj.x = thisobj.x;
    thisobj.y = thisobj.y;
    thisobj.vx = Math.cos(thisobj.aoa) * velocity;
    thisobj.vy = Math.sin(thisobj.aoa) * velocity;
    thisobj.Draw();
  };

  this.Draw = function () {
    var svg = thisobj.svg;
    var ball = svg.selectAll("#" + thisobj.id).data(thisobj.data);
    ball
      .enter()
      .append("circle")
      .attr("id", thisobj.id)
      .attr("class", "ball")
      .attr("r", thisobj.radius)
      .attr("weight", thisobj.weight)
      .style("fill", thisobj.color);
    ball
      //.transition()//.duration(50)
      .attr("cx", thisobj.x)
      .attr("cy", thisobj.y);
    // intersect ball is used to show collision effect - every ball has it's own intersect ball
    // var intersectBall = ball
    //   .enter()
    //   .append("circle")
    //   .attr("id", thisobj.id + "_intersect")
    //   .attr("class", "intersectBall");
  };

  this.Move = function () {
    var svg = thisobj.svg;

    //thisobj.x += Math.cos(thisobj.aoa) * thisobj.jumpSize;
    //thisobj.y += Math.sin(thisobj.aoa) * thisobj.jumpSize;

    thisobj.x += thisobj.vx;
    thisobj.y += thisobj.vy;

    if (parseInt(svg.attr("width")) <= thisobj.x + thisobj.radius) {
      thisobj.x = parseInt(svg.attr("width")) - thisobj.radius - 1;
      thisobj.aoa = Math.PI - thisobj.aoa;
      thisobj.vx = -thisobj.vx;
    }

    if (thisobj.x < thisobj.radius) {
      thisobj.x = thisobj.radius + 1;
      thisobj.aoa = Math.PI - thisobj.aoa;
      thisobj.vx = -thisobj.vx;
    }

    if (parseInt(svg.attr("height")) < thisobj.y + thisobj.radius) {
      thisobj.y = parseInt(svg.attr("height")) - thisobj.radius - 1;
      thisobj.aoa = 2 * Math.PI - thisobj.aoa;
      thisobj.vy = -thisobj.vy;
    }

    if (thisobj.y < thisobj.radius) {
      thisobj.y = thisobj.radius + 1;
      thisobj.aoa = 2 * Math.PI - thisobj.aoa;
      thisobj.vy = -thisobj.vy;
    }

    // **** NOT USING AOA except during initilization. Just left this for future reference *****
    if (thisobj.aoa > 2 * Math.PI) thisobj.aoa = thisobj.aoa - 2 * Math.PI;
    if (thisobj.aoa < 0) thisobj.aoa = 2 * Math.PI + thisobj.aoa;

    thisobj.Draw();
  };

  this.GoToInitialSettings(velocity);
}

function CheckCollision(ball1, ball2) {

  var absx = Math.abs(parseFloat(ball2.x) - parseFloat(ball1.x));
  var absy = Math.abs(parseFloat(ball2.y) - parseFloat(ball1.y));

  // find distance between two balls.
  var distance = absx * absx + absy * absy;
  distance = Math.sqrt(distance);
  // check if distance is less than sum of two radius - if yes, collision
  if (distance + ball1.radius * 0.3 < parseFloat(ball1.radius) + parseFloat(ball2.radius)) {
    return true;
  }
  return false;
}

//courtsey thanks to several internet sites for formulas
//detect collision, find intersecting point and set new speed+direction for each ball based on weight (weight=radius)
function ProcessCollision(ball1, ball2) {
  const balls = data.items;
  if (ball2 <= ball1) return;
  if (ball1 >= balls.length - 1 || ball2 >= balls.length) return;

  ball1 = balls[ball1];
  ball2 = balls[ball2];

  if (CheckCollision(ball1, ball2)) {
    // intersection point
    var interx =
      (ball1.x * ball2.radius + ball2.x * ball1.radius) /
      (ball1.radius + ball2.radius);
    var intery =
      (ball1.y * ball2.radius + ball2.y * ball1.radius) /
      (ball1.radius + ball2.radius);

    // // show collision effect for 500 miliseconds
    // var intersectBall = data.svg.select("#" + ball1.id + "_intersect");
    // intersectBall
    //   .attr("cx", interx)
    //   .attr("cy", intery)
    //   .attr("r", 5)
    //   .attr("fill", "black")
    //   .transition()
    //   .duration(500)
    //   .attr("r", 0);

    // calculate new velocity of each ball.
    var vx1 =
      (ball1.vx * (ball1.weight - ball2.weight) + 2 * ball2.weight * ball2.vx) /
      (ball1.weight + ball2.weight);
    var vy1 =
      (ball1.vy * (ball1.weight - ball2.weight) + 2 * ball2.weight * ball2.vy) /
      (ball1.weight + ball2.weight);
    var vx2 =
      (ball2.vx * (ball2.weight - ball1.weight) + 2 * ball1.weight * ball1.vx) /
      (ball1.weight + ball2.weight);
    var vy2 =
      (ball2.vy * (ball2.weight - ball1.weight) + 2 * ball1.weight * ball1.vy) /
      (ball1.weight + ball2.weight);

    //set velocities for both balls
    ball1.vx = vx1;
    ball1.vy = vy1;
    ball2.vx = vx2;
    ball2.vy = vy2;

    //ensure one ball is not inside others. distant apart till not colliding
    while (CheckCollision(ball1, ball2)) {
      ball1.x += ball1.vx;
      ball1.y += ball1.vy;

      ball2.x += ball2.vx;
      ball2.y += ball2.vy;
    }
    ball1.Draw();
    ball2.Draw();
  }
}
