import { clearCanvas } from "./util.js";
import GameButton from "./button.js";
import { drawAnalyser, NOTES, playNote } from "./audio.js";

let canvas = document.getElementById("mainCanvas");
let soundDebugCanvas = document.getElementById("soundDebug");
let hitcanvas=document.getElementById("hitCanvas");
soundDebugCanvas.height = 500;
soundDebugCanvas.width = 700;
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var ctx = canvas.getContext("2d");
var hitCtx = hitcanvas.getContext("2d");
var sdCtx = soundDebugCanvas.getContext("2d");
let buttons = [];
let hitbuttons=[];

// initialize canvas
const init = () => {
  let rotate = 0;
  for (let i = 0; i < 4; i++) {
    buttons.push(
      new GameButton(
        canvas,
        ctx,
        [canvas.width * 0.5, canvas.height * 0.5],
        300,
        300,
        null,
        [Math.random() * 100, Math.random() * 100],
        rotate
      )
    );
    buttons[i].onClick(() => {
      let randomNoteIndex = Math.floor(
        Math.random() * Object.keys(NOTES).length
      );
      let randomNote = Object.keys(NOTES)[randomNoteIndex];
      console.log(randomNote)
      playNote(NOTES[randomNote], 3);
    });
    buttons[i].onHover(() => {
    });
    rotate += 90;
  }
};

const animationLoop = () => {
  clearCanvas(ctx, canvas);
  clearCanvas(sdCtx, soundDebugCanvas);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  drawAnalyser(soundDebugCanvas, sdCtx);
  window.requestAnimationFrame(animationLoop);
};
init();
animationLoop();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
