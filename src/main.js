import { clearCanvas } from "./util.js";
import { Button, GameButton } from "./button.js";
import {
  drawAnalyser,
  NOTES,
  playNote,
} from "./audio.js";

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
let startButton;
let roundLength = 5; // how long sequence is on this round
let points = 0; // player
let round = [];
const GAME_NOTES = [NOTES.C, NOTES.D, NOTES.G, NOTES.E];

const generateNewRound = () => {
  let newRound = [];
  for (let i = 0; i < roundLength; i++) {
    let randomGameNoteIndex = Math.floor(Math.random() * GAME_NOTES.length);
    newRound.push(
      playNote(GAME_NOTES[randomGameNoteIndex], 1)
    );
  }
  return newRound;
};
const nextRound = () => {
  //need some trigger to start the next round
  gameLength++;
  playOrder();
};

const playRound = () => {
  round.reduce(
    (previous, current) => previous.then(current),
    Promise.resolve()
  );
};

const startGame = () => {
/*   for (let i = 0; i < buttons.length; i++) {
    buttons[i].isPlayingSound = false;
  }
  round = generateNewRound();
  playRound(); */
  const asd = playNote(GAME_NOTES[0], 2);
};

const gameIntro = () => {};

// initialize canvas
const init = () => {
  // initialize game buttons
  let rotate = 0;
  let hue = 0;
  for (let i = 0; i < 4; i++) {
    buttons.push(
      new GameButton(
        canvas,
        ctx,
        [canvas.width * 0.5, canvas.height * 0.5],
        300,
        300,
        null,
        [hue, 100],
        rotate
      )
    );
    buttons[i].onClick(() => {
      playNote(GAME_NOTES[i], 1);
    });
    buttons[i].onHover(() => {
      console.log("asdsd");
    });
    buttons[i].isDisabled = true;
    rotate += 90;
    hue += 25;
  }
  // initialize start button
  startButton = new Button(
    canvas,
    ctx,
    [canvas.width * 0.4, canvas.height * 0.8],
    200,
    100,
    "Play the game!",
    [70, 50],
    0
  );
  startButton.onClick(startGame);
  startButton.onHover(() => {
    //console.log("hover start")
  });
};

const animationLoop = () => {
  clearCanvas(ctx, canvas);
  clearCanvas(sdCtx, soundDebugCanvas);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  startButton.draw();
  drawAnalyser(soundDebugCanvas, sdCtx);
  window.requestAnimationFrame(animationLoop);
};

init();
animationLoop();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
