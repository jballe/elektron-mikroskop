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
  this.color = `url(#${type.id})`;

  this.data = [this.id]; // allow us to use d3.enter()
  const thisobj = this;

  // Now aoa and speed together is velocity
  this.vx = Math.cos(thisobj.aoa) * thisobj.velocity; // velocity x
  this.vy = Math.sin(thisobj.aoa) * thisobj.velocity; // velocity y
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
      .attr("cx", thisobj.x)
      .attr("cy", thisobj.y);
  };

  this.Move = function () {
    var svg = thisobj.svg;

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

    thisobj.Draw();
  };

  this.GoToInitialSettings(velocity);
}

export { Ball };
