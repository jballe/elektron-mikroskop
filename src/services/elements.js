const canvas = document.querySelector("canvas");
const video = document.querySelector("video");
const wrapper = document.querySelector("#wrapper");
const svg = document.querySelector("svg");

export function hide(elm) {
  elm.style.display = "none";
}
export function show(elm) {
  elm.style.display = "";
}
export { canvas, video, svg, wrapper };
