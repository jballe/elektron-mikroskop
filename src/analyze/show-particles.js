import * as d3 from "d3";
import { svg } from "../services/elements";
import samples from "../definitions/samples";
import types from "../definitions/particles";
import { Ball } from "./particle-ball";
import { ProcessCollision } from "./particle-collisions";

const data = {
  items: [],
  running: false,
  svg: null,
};

export function startRenderParticles(item) {
  const definition = samples[item];
  svg.innerHTML = createSvgPatterns();
  initializeD3();
  createParticlesForDefinition(definition);
  startStop();
  loop();
}

export function stopRenderParticles() {
  data.running = false;
  svg.innerHTML = "";
}

function createSvgPatterns() {
  let str = "";
  for (const t of Object.keys(types)) {
    const type = types[t];
    str += `<pattern id="${type.id}" x="0" y="0" height="40" width="40"><image x="0" y="0" width="50" height="50" xlink:href="${type.href}" /></pattern>`;
  }
  return str;
}

function initializeD3() {
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

function createParticlesForDefinition(definition) {
  if (!definition ||!definition.result) throw 'No definition to render';
  const def = definition.result;

  const maxX = svg.clientWidth;
  const maxY = svg.clientHeight;

  for (const type of Object.keys(def)) {
    for (let counter = 0; counter < def[type]; counter++) {
      const typeDef = types[type];
      if(!typeDef) throw `Could not find any type ${type} referenced in ${definition.title}`;

      const startX = Math.floor(Math.random() * maxX);
      const startY = Math.floor(Math.random() * maxY);
      const angle = Math.floor(Math.random() * 359);
      let velocity = (Math.random() - 0.5) * 2 * typeDef.velocity;
      if (velocity === 0) velocity = 0.1;
      const id = `${type}_${counter}`;
      console.log(
        `Creating ${id} starting at (${startX},${startY}) with angle ${angle}...`
      );
      data.items.push(
        new Ball(data.svg, startX, startY, id, angle, typeDef, velocity)
      );
    }
  }
}

export function startStop() {
  if (data.running) {
    data.running = false;
    return;
  }

  data.running = true;
  d3.timer(loop, 500);
}

function loop() {
  for (var i = 0; i < data.items.length; ++i) {
    var r = data.items[i].Move();
    for (var j = i + 1; j < data.items.length; ++j) {
      ProcessCollision(data.items, i, j);
    }
  }
  return data.running;
}
