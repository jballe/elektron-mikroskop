import * as tfjs from "@tensorflow/tfjs";
import * as automl from '@tensorflow/tfjs-automl';
var modelData = require('./automl-model.json');

export async function setupDetection() {
    return await automl.loadObjectDetection(modelData);
  }
  
  export async function detect(model, video) {
      // default options
    const options = {score: 0.5, iou: 0.5, topk: 20};
    const results = await model.detect(video, options);
    return results.filter((x) => x.class !== "person");
  }
  