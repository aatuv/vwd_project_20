import { clearCanvas, drawInfoText } from "./util.js";
import { Button, GameButton } from "./button.js";
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
let infoText = "Start the game!";
let buttons = [];
let startButton;
let roundLength = 2; // how long sequence is on this round
let points = 0; // player
let round = [];
let playedNotes = [];
const GAME_NOTES = [NOTES.C, NOTES.D, NOTES.G, NOTES.E];

const generateNewRound = () => {
  let newRound = [];
  for (let i = 0; i < roundLength; i++) {
    let randomGameNoteIndex = Math.floor(Math.random() * GAME_NOTES.length);
    newRound.push(GAME_NOTES[randomGameNoteIndex]);
  }
  return newRound;
};
const nextRound = () => {
  //need some trigger to start the next round
  roundLength++;
  round = generateNewRound();
  setTimeout(playRound, 1000);
};

const endRound = () => {
  playedNotes = [];
  round = [];
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].isDisabled = true;
    buttons[i].onClick(() => {});
  }
  infoText = "get ready for next round!";
  setTimeout(() => {
    infoText = "Round starting...";
    nextRound();
  }, 3000);
};

const gameEnded = () => {
  infoText = "you failed! The game has ended.";
  roundLength = 2;
};

const addToPlayedNotesArray = (note) => {
  console.log(playedNotes);
  playedNotes.push(note);
  if (playedNotes.length === round.length) {
    endRound();
  }
  if (playedNotes[playedNotes.length - 1] !== round[playedNotes.length - 1]) {
    gameEnded();
  } else {
    infoText = "Correct!";
  }
};

const playRound = () => {
  let counter = 0;
  // first show the order of buttons to press
  const awaitRound = () => {
    infoText = "playing round...";
    return new Promise((resolve, reject) => {
      setInterval(() => {
        if (counter < round.length) {
          buttons.find((button) => button.note === round[counter]).lightUp(900);
          playNote(round[counter], 1);
          counter++;
        } else {
          clearInterval();
          resolve();
        }
      }, 1000);
    });
  };

  // make buttons clickable for player
  const activateButtons = () => {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].isDisabled = false;
      buttons[i].onClick(() => {
        playNote(buttons[i].note, 1);
        addToPlayedNotesArray(buttons[i].note);
      });
    }
    infoText = "Your turn!";
  };

  awaitRound().then(() => {
    activateButtons();
  });
};

const startGame = () => {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].isPlayingSound = true;
  }
  round = generateNewRound();
  playRound();
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
        rotate,
        GAME_NOTES[i]
      )
    );
    buttons[i].onHover(() => {});
    buttons[i].isDisabled = true;
    rotate += 90;
    hue += 25;
  }
  // initialize start button
  startButton = new Button(
    canvas,
    ctx,
    [canvas.width * 0.4, canvas.height * 0.85],
    400,
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
  drawInfoText(ctx, infoText, [canvas.width * 0.5, canvas.height * 0.1]);
  window.requestAnimationFrame(animationLoop);
};

init();
animationLoop();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
