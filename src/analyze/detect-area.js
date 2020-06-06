import {
  Marvin,
  createMarvinImageFromCanvas,
} from "../services/image";
import { canvas as canvasElm } from "../services/elements";

const canvas = canvasElm;
const numberOfPointsThreshold = 300;

export async function setupDetection() {}

window.intensity = 0.5;

export function detect() {
  const img = createMarvinImageFromCanvas(canvas);
  const points = detectEdgePoints(img);

  colorDetectedArea(points);
  if (points.length < numberOfPointsThreshold) return null;

  const box = tryToCreateBoundingBox(points);
  return {
    box: box,
    points: points,
  };
}

function detectEdgePoints(img) {
  Marvin.prewitt(img.clone(), img, window.intensity);
  Marvin.invertColors(img, img);
  Marvin.thresholding(img, img, 78);

  const points = [];
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      const color = img.getIntColor(x, y) & 0x00ffffff;
      if (color === 0) {
        points.push([x, y]);
      }
    }
  }

  return points;
}

function tryToCreateBoundingBox(points) {
  let minX = -1,
    minY = -11,
    maxX = -1,
    maxY = -1;
  points.forEach((p) => {
    const x = p[0];
    const y = p[1];

    if (minX == -1 || x < minX) {
      minX = x;
    }
    if (maxX == -1 || x > maxX) {
      maxX = x;
    }
    if (minY == -1 || y < minY) {
      minY = y;
    }
    if (maxY == -1 || y > maxY) {
      maxY = y;
    }
  });

  return {
    left: minX,
    top: minY,
    right: maxX,
    bottom: maxY,
  };
}

function colorDetectedArea(points) {
  const ctx = canvas.getContext("2d");

  ctx.fillStyle =  (points.length < numberOfPointsThreshold) ? "#ff0000" : "#00ff00";

  points.forEach((p) => {
    const x = p[0];
    const y = p[1];

    ctx.fillRect(Math.floor(x), Math.floor(y), 10, 10);
  });
}
