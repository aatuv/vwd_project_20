import { clearCanvas, drawText, displayInfo } from "./util.js";
import { Button, GameButton } from "./button.js";
import { drawAnalyser, NOTES, playNote } from "./audio.js";

let canvas = document.getElementById("mainCanvas");
/* let soundDebugCanvas = document.getElementById("soundDebug"); */
//let startButton = document.getElementById("startButton");
/* soundDebugCanvas.height = 500;
soundDebugCanvas.width = 700; */
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var ctx = canvas.getContext("2d");
/* var sdCtx = soundDebugCanvas.getContext("2d"); */
let infoText = "Start the game!";
let buttons = [];
let startButton;
let infoButton;
let roundLength = 3; // how long sequence is on this round
let points = 0;
let gameIsRunning = false;
let round = []; // correct notes for this round
let playedNotes = []; // the notes that the player has played this round
const GAME_NOTES = [NOTES.C, NOTES.D, NOTES.G, NOTES.E]; // notes mapped to gameButtons


// generate a new round randomly and return it
const generateNewRound = () => {
  let newRound = [];
  for (let i = 0; i < roundLength; i++) {
    let randomGameNoteIndex = Math.floor(Math.random() * GAME_NOTES.length);
    newRound.push(GAME_NOTES[randomGameNoteIndex]);
  }
  return newRound;
};

const nextRound = () => {
  if (gameIsRunning) {
    playedNotes = [];
    round = [];
    roundLength++;
    round = generateNewRound();
    setTimeout(playRound(), 1000);
  }
};

// end current round and start a move to the next one
const endRound = () => {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].isDisabled = true;
    buttons[i].dim();
    buttons[i].onClick(() => {});
  }
  infoText = "get ready for next round!";
  var audio = new Audio("https://dl.dropbox.com/s/zp3hwkf1vrimq6e/magic1.mp3");
  audio.play();
  setTimeout(() => {
    infoText = "Round starting...";
    nextRound();
  }, 3000);
};

const disableGameButtons = () => {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].isDisabled = true;
    buttons[i].isPlayingSound = false;
    buttons[i].dim();
  }
};

// the game has ended, set initialize game variables
// TODO: show final score
const gameEnded = () => {
  infoText = `The game has ended! Your score was ${points} points.`;
  round = [];
  playedNotes = [];
  points = 0;
  gameIsRunning = false;
  disableGameButtons();
  roundLength = 3;
  var audio = new Audio("https://dl.dropbox.com/s/o8kfeq9cz0pvi9v/fail1.mp3");
  audio.play();
};

// add the gameButton's note to the playedNotes array, validate if the player remembered the right sequence or not and execute actions accordingly.
const addToPlayedNotesArray = (note) => {
  playedNotes.push(note);
  if (playedNotes.length === round.length) {
    endRound();
  }
  if (playedNotes[playedNotes.length - 1] !== round[playedNotes.length - 1]) {
    gameEnded();
  } else {
    infoText = "Correct!";
    points += 10;
    setTimeout(() => {
      infoText = "";
    }, 500);
  }
};

// play the current round. first show the generated sequence, then "give the ball" to the player
const playRound = () => {
  let counter = 0;

  // first show the order of buttons to press
  const awaitRound = () => {
    infoText = "playing round...";
    let playRoundNotes;
    return new Promise((resolve, reject) => {
      playRoundNotes = setInterval(() => {
        if (counter < round.length) {
          buttons.find((button) => button.note === round[counter]).lightUp(900);
          playNote(round[counter], 1);
          counter++;
        } else {
          clearInterval(playRoundNotes);
          resolve();
        }
      }, 1000);
    });
  };

  // make buttons clickable for player
  const activateButtons = () => {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].isDisabled = false;
    }
    infoText = "Your turn!";
  };

  awaitRound().then(() => {
    activateButtons();
  });
};

const startGame = () => {
  gameIsRunning = true;
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].isPlayingSound = true;
  }
  round = generateNewRound();
  playRound();
};

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
    buttons[i].onClick(() => {
      playNote(buttons[i].note, 1);
      addToPlayedNotesArray(buttons[i].note);
    });
    buttons[i].onHover(() => {});
    buttons[i].isDisabled = true;
    rotate += 90;
    hue += 25;
  }
  // initialize start button
  startButton = new Button(
    canvas,
    ctx,
    [canvas.width * 0.6, 0],
    250,
    70,
    "Play the game!",
    [70, 90],
    0
  );
  startButton.onClick(startGame);
  startButton.onHover(() => {
    //console.log("hover start")
  });

  infoButton = new Button(
    canvas,
    ctx,
    [canvas.width * 0.3, 0],
    250,
    70,
    "About the game",
    [30, 80],
    0
  );
  infoButton.onClick(displayInfo);
  infoButton.onHover(() => {
    //console.log("hover start")
  });
};

const animationLoop = () => {
  clearCanvas(ctx, canvas);
/*   clearCanvas(sdCtx, soundDebugCanvas); */
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  startButton.draw();
  infoButton.draw();
/*   drawAnalyser(soundDebugCanvas, sdCtx); */
  drawText(ctx, infoText, [canvas.width * 0.45, canvas.height * 0.12]);
  drawText(ctx, `Points: ${points}`, [canvas.width * 0.45, canvas.height * 0.165]);
  drawText(ctx, "Team 20", [canvas.width * 0.5 - 75, canvas.height * 0.50], 40, 150)
  window.requestAnimationFrame(animationLoop);
};

init();
animationLoop();

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
