import * as tfjs from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

export async function setupDetection() {
  return await cocoSsd.load();
}

export async function detect(model, video) {
  const results = await model.detect(video);
  return results
    .filter((x) => x.class !== "person")
    .map((obj) => mapResult(obj));
}

function mapResult(obj) {
  obj.box = {
    left: obj.bbox[0],
    top: obj.bbox[1],
    width: obj.bbox[2],
    height: obj.bbox[3],
  };
  return obj;
}
