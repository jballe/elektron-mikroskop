import { video } from "./elements";

const streamPromise = new Promise(async (resolve) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 640, height: 480, facingMode: "environment" },
  });
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
    resolve(video);
  };
});

export function getVideo() {
  return streamPromise;
}
