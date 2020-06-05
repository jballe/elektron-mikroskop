import { video } from "./elements";

export function setupVideo() {
  return new Promise(async (resolve) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      resolve(video);
    };
  });
}
