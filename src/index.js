import { setupDetection, detect } from "./detection-cco-ssd";
// import { setupDetection, detect } from "./detection-automl";
import { setupVideo } from "./video";
import { setupRender, renderResults } from "./render";

async function setup() {
  const model = await setupDetection();
  const video = await setupVideo();
  const ctx = await setupRender();
  detectFrame(model, video, ctx);
}

async function detectFrame(model, video, ctx) {
  const results = await detect(model, video);
  await renderResults(results, ctx);

  requestAnimationFrame(async () => detectFrame(model, video, ctx));
}

setup().then(() => console.log("ok"));
