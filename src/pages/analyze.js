import { canvas, svg, video, show, hide } from "../services/elements";
import { getVideo } from "../services/video";
import { detect } from "../analyze/detect-area";
import {
  startRenderParticles,
  stopRenderParticles,
} from "../analyze/show-particles";

const backgroundColor = "#cc0000";
const frameCountThreshold = 10;
const ctx = canvas.getContext("2d");
const data = {
  mode: "search",
  forFrames: 0,
  item: null,
  resolve: null,
  raf: null,
  counter: 0,
};

export async function analyzeScreen(chosenItem) {
  data.item = chosenItem;
  show(canvas);

  canvas.addEventListener("click", clickHandler);
  data.video = await getVideo();
  data.mode = "search";
  data.raf = requestAnimationFrame(loop);
  return new Promise((resolveFunc) => {
    data.resolve = resolveFunc;
  }).then(cleanup);
}

function cleanup() {
  canvas.removeEventListener("click", clickHandler);
  hide(canvas);
  hide(svg);
}

function clickHandler() {
  if (data.raf) {
    cancelAnimationFrame(data.raf);
  } else {
    data.raf = requestAnimationFrame(loop);
  }
}

async function loop() {
  if (data.mode !== "search" && ++data.counter % 5 !== 0) {
    data.raf = requestAnimationFrame(loop);
    return;
  }

  ctx.drawImage(data.video, 0, 0, canvas.width, canvas.height);

  if (data.mode === "search") {
    const result = detect();
    determineStartRender(result);
    // } else if (data.mode === "render") {
    //   determineStopRender(result);
    // } else if (data.mode === "exit") {
  }

  data.raf = requestAnimationFrame(loop);
}

function determineStartRender(result) {
  // something about moving box?
  if (result) {
    data.forFrames++;
    if (data.forFrames > frameCountThreshold) {
      data.found = true;
      data.forFrames = 0;
      data.mode = "render";
      startRender(result);
    }
  } else {
    data.forFrames = 0;
  }
}

function determineStopRender(result) {
  // something about moving box?
  if (result) {
    data.forFrames = 0;
    return;
  }

  if (++data.forFrames > 3) {
    data.found = false;
    data.mode = "exit";
    startExit();
  }
}

function startRender(result) {
  // zoom to result box?
  // move svg to result box?
  show(svg);
  svg.style.backgroundColor = backgroundColor;
  startRenderParticles(data.item);
  document.addEventListener("click", stopClickHandler);
  hide(canvas);
}

function stopClickHandler() {
  document.removeEventListener("click", stopClickHandler);
  data.mode = "exit";
  startExit();
}

function startExit() {
  show(canvas);
  hide(svg);
  stopRenderParticles();
  // show camera for a while...?
  cancelAnimationFrame(data.raf);
  data.resolve();
}
