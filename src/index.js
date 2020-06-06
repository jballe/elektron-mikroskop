//import { setupDetection, detect } from "./detection-cco-ssd";
//import { setupDetection, detect } from './detection-pixfinder';
import { setupDetection, detect } from "./detection-marvinj";
import { setupVideo } from "./video";
import { setupRender, renderResults } from "./render";
import { canvas, video } from "./elements";
import { renderParticles } from "./particles.js";

const data = {
  canvas: canvas,
  canvasCtx: canvas.getContext("2d"),
};

async function setup() {
  data.model = await setupDetection();
  data.video = await setupVideo();
  data.ctx = await setupRender();

  canvas.addEventListener("dblclick", () => {
    if (data.raf) {
      stop();
    } else {
      start();
    }
  });
}

async function loop() {
  data.canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const results = await detect(data.model, data.canvas);
  await renderResults(results, data.ctx);

  data.raf = requestAnimationFrame(loop);
}

async function start() {
  console.log("Starting...");
  data.raf = requestAnimationFrame(loop);
}

async function stop() {
  console.log("Stopping...");
  cancelAnimationFrame(data.raf);
  data.raf = null;
}

// setup().then(start).then(() => console.log("ok"));
renderParticles();
