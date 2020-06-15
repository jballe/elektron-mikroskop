import { svg, video, show, hide } from "../services/elements";
import { getVideo } from "../services/video";
import {
  startRenderParticles,
  stopRenderParticles,
} from "../analyze/show-particles";

const backgroundColor = "#cc0000";
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
  show(video);

  document.addEventListener("click", clickHandler);
  data.video = await getVideo();
  data.mode = "search";

  return new Promise((resolveFunc) => {
    data.resolve = resolveFunc;
  }).then(cleanup);
}

function cleanup() {
  document.removeEventListener("click", clickHandler);
  hide(svg);
  hide(video);
}

function clickHandler() {
  if (data.mode === "search") {
    data.mode = "search2";
  } else if (data.mode === "search2") {
    startRender();
  } else {
    startExit();
  }
}

function startRender(result) {
  data.mode = "analyze";
  // zoom to result box?
  // move svg to result box?
  show(svg);
  svg.style.backgroundColor = backgroundColor;
  startRenderParticles(data.item);
}

function stopClickHandler() {
  document.removeEventListener("click", stopClickHandler);
  data.mode = "exit";
  startExit();
}

function startExit() {
  data.mode = "exit";
  hide(svg);
  stopRenderParticles();
  data.resolve();
}
