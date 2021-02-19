import { clearCanvas } from "./util.js";
import GameButton from "./button.js";
import startButton from "./button.js";
import { drawAnalyser, NOTES, playNote } from "./audio.js";

let canvas = document.getElementById("mainCanvas");
let soundDebugCanvas = document.getElementById("soundDebug");
//let startButton = document.getElementById("startButton");
soundDebugCanvas.height = 500;
soundDebugCanvas.width = 700;
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var ctx = canvas.getContext("2d");
var sdCtx = soundDebugCanvas.getContext("2d");
let buttons = [];
var gameLength=1;

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
  new startButton(canvas, ctx, [canvas.width * 0.5, canvas.height * 0.9],
    200,
    200,
    "Play the game!",
    [Math.random() * 100, Math.random() * 100],
    0);
  
};
const playOrder=()=>{
  for (i=0; i<gameLength.length; i++){
    let randomNoteIndex = Math.floor(
    Math.random() * Object.keys(NOTES).length
  );
  var order=[];
  let randomNote = Object.keys(NOTES)[randomNoteIndex];
  console.log(randomNote)
  order[i]=randomNote;
  playNote(order[i], 3);
    }
    
}
const nextRound=()=>{   //need some trigger to start the next round
  gameLength++;
  playOrder();
}

const animationLoop = () => {
  clearCanvas(ctx, canvas);
  clearCanvas(sdCtx, soundDebugCanvas);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  //startButton.draw();
  drawAnalyser(soundDebugCanvas, sdCtx);
  window.requestAnimationFrame(animationLoop);
};

init();
animationLoop();


window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
