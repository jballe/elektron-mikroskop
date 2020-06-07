import * as tfjs from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { video } from "../services/elements";

const data = {};
export async function setupDetection() {
  data.model = await cocoSsd.load();
}

export async function detect() {
  if(!data.model) {
    console.log('waiting for model...');
    return null;
  }
  
  const results = await data.model.detect(video);
  const mapped = results
    .filter((x) => x.class !== "person")
    .map((obj) => mapResult(obj));
  return mapped.length === 0 ? null : mapped;
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
