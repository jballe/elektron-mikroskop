import * as splashImgUrl from "../../public/assets/splash.png";
//import * as splashImgUrl from "file-loader?outputPath=images&name=[name].[contenthash].[ext]!../../public/assets/splash.png";
import { canvas, hide, show } from "../services/elements";
import {
  createImg,
  Marvin,
  createMarvinImageFromCanvas,
} from "../services/image";
import { getVideo } from "../services/video";

const el = canvas;
const ctx = canvas.getContext("2d");
let raf = null,
  video = null,
  splashImg = null,
  splashX = null,
  splashY = null;

export async function splashScreen() {
  show(canvas);
  video = await getVideo();
  //splashImg = await createImg(`data:image/png;base64,${splashImgBase64}`);
  splashImg = await createImg(splashImgUrl.default);
  splashX = (canvas.width - splashImg.width) / 2;
  splashY = (canvas.height - splashImg.height) / 2;

  const clickPromise = new Promise((resolve) => {
    const handler = () => {
      resolve();
      el.removeEventListener("click", handler);
      cancelAnimationFrame(raf);
      raf = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hide(canvas);
    };
    el.addEventListener("click", handler);
  });
  raf = requestAnimationFrame(loop);
  return clickPromise;
}

async function loop() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  //   const mv = createMarvinImageFromCanvas(canvas);
  //   Marvin.gaussianBlur(mv, mv, 70);
  //   mv.draw(canvas);
  ctx.drawImage(splashImg, splashX, splashY, splashImg.width, splashImg.height);
  raf = requestAnimationFrame(loop);
}
