import { video, wrapper, show, hide } from "./elements";

const storageItemKey = 'videoId';
const storage = window.localStorage;
let choiceResolve = null;

const streamPromise = new Promise(async (resolve) => {
  const id = await findDeviceId();

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 640,
      height: 480,
      //facingMode: "environment",
      deviceId: { exact: id },
    },
  });
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
    resolve(video);
  };
});

async function findDeviceId() {
  let chosenId = storage.getItem(storageItemKey);

  const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
    (x) => x.kind === "videoinput"
  );

  if(devices.length === 1) {
    return devices[0].deviceId;
  }

  const chosenDevice = devices.filter(x => x.deviceId === chosenId);
  if(chosenDevice.length === 1) return chosenId;

  const deviceId = await chooseDevice(devices);
  storage.setItem(storageItemKey, deviceId);
  return deviceId;
}


function chooseDevice(devices) {
  show(wrapper);
  createChoices(devices)
  const chosen = new Promise(resolve => {
    choiceResolve = resolve;
  });
  return chosen.then(value => {
    choiceCleanup();
    return value;
  });
}

function createChoices(devices) {
  wrapper.innerHTML = '';
  for (const obj of devices) {
    const btn = document.createElement("button");
    btn.id = obj.deviceId;
    btn.className = "option";
    btn.innerText = obj.label;
    wrapper.appendChild(btn);
  }
  wrapper.addEventListener("click", clickHandler);
}

function clickHandler(evt) {
  const id = evt.target.id;
  if (id) {
    choiceResolve(id);
  }
}

function choiceCleanup() {
  wrapper.innerHTML = "";
  wrapper.removeEventListener('click', clickHandler);
  hide(wrapper);
  hide(video);
}


export function getVideo() {
  return streamPromise;
}
