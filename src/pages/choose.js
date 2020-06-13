import { show, hide, video, wrapper } from "../services/elements";
import samples from "../definitions/samples";
require("./choose.css");

let resolve = null;

export function chooseScreen() {
  show(wrapper);
  show(video);
  createChoices();

  return new Promise((resolveFunc) => {
    resolve = resolveFunc;
  }).then((result) => {
    cleanup();
    return result;
  });
}

function createChoices() {
  for (const id of Object.keys(samples)) {
    const obj = samples[id];
    const btn = document.createElement("button");
    btn.id = id;
    btn.className = "option";
    btn.innerText = obj.title;
    wrapper.appendChild(btn);
  }
  wrapper.addEventListener("click", clickHandler);
}

function clickHandler(evt) {
  const id = evt.target.id;
  if (id) {
    resolve(id);
  }
}

function cleanup() {
  wrapper.innerHTML = "";
  wrapper.removeEventListener('click', clickHandler);
  hide(wrapper);
  hide(video);
}
