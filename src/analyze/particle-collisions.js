// From http://bl.ocks.org/atul-github/0019158da5d2f8499f7f
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
  export function ProcessCollision(balls, ball1Index, ball2Index) {
    if (ball2Index <= ball1Index) return;
    if (ball1Index >= balls.length - 1 || ball2Index >= balls.length) return;
  
    const ball1 = balls[ball1Index];
    const ball2 = balls[ball2Index];
  
    if (CheckCollision(ball1, ball2)) {
      // intersection point
    //   var interx =
    //     (ball1.x * ball2.radius + ball2.x * ball1.radius) /
    //     (ball1.radius + ball2.radius);
    //   var intery =
    //     (ball1.y * ball2.radius + ball2.y * ball1.radius) /
    //     (ball1.radius + ball2.radius);
  
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
  