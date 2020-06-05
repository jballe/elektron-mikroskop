var body = document.querySelector("body");

function applyStyling(e) {
    e.style.position = "fixed";
    e.style.top = "0";
    e.style.left= "0";
    e.style.right= "0";
    e.style.bottom= "0";
}

var video = document.querySelector('video'); // document.createElement("video");
applyStyling(video)
//body.appendChild(video);

var canvas = document.createElement("canvas");
applyStyling(canvas)
body.appendChild(canvas);

var svg = document.querySelector("svg");
applyStyling(svg)
//body.appendChild(svg);

export { canvas, video, svg };
