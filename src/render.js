import { svg as svgElm, canvas } from "./elements";

let foundItems = [];

export async function setupRender() {
  // return canvas.getContext("2d");
  return svgElm;
}

export async function renderResults(detectedItems, ctx) {
  logResults(detectedItems);
  // renderCanvasBoxes(detectedItems, ctx);
  drawSvgBoxes(detectedItems);
}

function logResults(detectedItems) {
  detectedItems.forEach((itm) => {
    console.log(itm);
  });
}

function renderCanvasBoxes(predictions, ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Font options.
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";
  predictions.forEach((prediction) => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    const width = prediction.bbox[2];
    const height = prediction.bbox[3];
    // Draw the bounding box.
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);
    // Draw the label background.
    ctx.fillStyle = "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
  });

  predictions.forEach((prediction) => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    // Draw the text last to ensure it's on top.
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);
  });
}

function drawSvgBoxes(predictions) {
  const svg = svgElm;
  foundItems.forEach((e) => svg.removeChild(e));
  foundItems = [];
  predictions.forEach((prediction) => {
    const box = prediction.box || prediction.bbox;
    const label = prediction.label || prediction.class;
    const score = prediction.score;
    const { left, top, width, height } = box;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("x", left);
    rect.setAttribute("y", top);
    rect.setAttribute("class", "box");
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", left + width / 2);
    text.setAttribute("y", top);
    text.setAttribute("dy", 12);
    text.setAttribute("class", "label");
    text.textContent = `${label}: ${score.toFixed(3)}`;
    svg.appendChild(rect);
    svg.appendChild(text);
    foundItems.push(rect);
    foundItems.push(text);
    const textBBox = text.getBBox();
    const textRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    textRect.setAttribute("x", textBBox.x);
    textRect.setAttribute("y", textBBox.y);
    textRect.setAttribute("width", textBBox.width);
    textRect.setAttribute("height", textBBox.height);
    textRect.setAttribute("class", "label-rect");
    svg.insertBefore(textRect, text);
    foundItems.push(textRect);
  });
}
