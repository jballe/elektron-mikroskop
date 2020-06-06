import { Marvin, MarvinImage } from "exports-loader?MarvinImage,Marvin!marvinj";

export function createImg(uri) {
  return new Promise((resolve) => {
    var img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = uri;
  });
}

export function createMarvinImageFromCanvas(canvas) {
  const img = new MarvinImage(canvas.width, canvas.height);
  const fakeLoadedImage = {
    image: canvas,
    getWidth: () => canvas.width,
    getHeight: () => canvas.height,
  };
  img.callbackImageLoaded(fakeLoadedImage);
  return img;
}

export { Marvin };
