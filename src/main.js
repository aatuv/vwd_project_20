import { clearCanvas, drawText, displayInfo } from "./util.js";
import { Button, GameButton, StartButton } from "./button.js";
import { drawAnalyser, NOTES, playNote } from "./audio.js";
import { Moon, Rocket, Particle, BackroundNote } from "./scene.js";

let canvas = document.getElementById("mainCanvas");

// receives one point per round.
let points = 0;
// how many passed rounds are needed to win.
let pointsTarget = 6;
// rocket to moon stuff
let rocketCanvas = document.getElementById("rocketCanvas");
rocketCanvas.height = window.innerHeight;
rocketCanvas.width = window.innerWidth;
var rcCtx = rocketCanvas.getContext("2d");
let rocket;
let moon;
const moonPosition = { x: rocketCanvas.width * 0.2, y: 50 };
const rocketPosition = {
  x: rocketCanvas.width * 0.2 + 5,
  y: rocketCanvas.height * 0.75,
};
let rocketStep = (rocketPosition.y - moonPosition.y) / pointsTarget;
/* let soundDebugCanvas = document.getElementById("soundDebug"); */
//let startButton = document.getElementById("startButton");
/* soundDebugCanvas.height = 500;
soundDebugCanvas.width = 700; */
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var ctx = canvas.getContext("2d");
/* var sdCtx = soundDebugCanvas.getContext("2d"); */
let infoText = "";
let buttons = [];
let startButton;
let infoButton;
let roundLength = 3; // how long sequence is on this round
let gameIsRunning = false;
let round = []; // correct notes for this round
let playedNotes = []; // the notes that the player has played this round
const GAME_NOTES = [NOTES.C, NOTES.D, NOTES.G, NOTES.E]; // notes mapped to gameButtons
let victoryAnimation = false;
let particleArray = [];

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
// if player reached moon, end game
const endRound = () => {
  points += 1;
  rocket.targetY = rocket.y - rocketStep;
  rocket.playSound();
  if (points < pointsTarget) {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].isDisabled = true;
      buttons[i].dim();
      buttons[i].onClick(() => {});
    }
    infoText = "Get ready...";
    var audio = new Audio(
      "https://dl.dropbox.com/s/zp3hwkf1vrimq6e/magic1.mp3"
    );
    audio.play();
    setTimeout(() => {
      infoText = "";
      nextRound();
    }, 2000);
  } else {
    console.log("asd")
    moon.playSound();
    round = [];
    playedNotes = [];
    points = 0;
    gameIsRunning = false;
    victoryAnimation = true;
    disableGameButtons();
    roundLength = 3;
    setTimeout(() => {
      startButton.lightUp();
      startButton.isDisabled = false;
      victoryAnimation = false;
      rocket.y = rocketPosition.y;
      rocket.targetY = rocketPosition.y;
      initParticles()
    }, 5000);
  }
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
  infoText = "";
  round = [];
  playedNotes = [];
  points = 0;
  gameIsRunning = false;
  startButton.lightUp();
  startButton.isDisabled = false;
  disableGameButtons();
  rocket.y = rocketPosition.y;
  rocket.targetY = rocketPosition.y;
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
    infoText = "";
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
    infoText = "";
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
    infoText = "";
  };

  awaitRound().then(() => {
    activateButtons();
  });
};

const startGame = () => {
  gameIsRunning = true;
  startButton.dim();
  startButton.isDisabled = true;
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].isPlayingSound = true;
  }
  round = generateNewRound();
  playRound();
};

let brnotes=[];
function addnotes(){
  const angleIncrement=Math.PI*2/10;
  for(var i=0;i<10;i++){
    var red=Math.random()*255;
    var green=Math.random()*255;
    var blue=Math.random()*255;
    brnotes.push(new BackroundNote(rcCtx, rocketCanvas, canvas.width * 0.5, canvas.height * 0.5, 20, "rgba("+red+","+green+","+blue+","+1+")", {x:Math.cos(Math.random()*angleIncrement*i), y:Math.sin(Math.random()*angleIncrement*i)}))
  }
}
addnotes();

const initParticles = () => {
  particleArray = []
  for (let i = 0; i < 500; i++) {
    particleArray.push(
      new Particle(
        rcCtx,
        rocketCanvas,
        Math.round(Math.random() * rocketCanvas.width),
        Math.round(
          Math.random() * (moonPosition.y + 20 - moonPosition.y - 20) +
            moonPosition.y -
            20
        )
      )
    );
  }
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
  startButton = new StartButton(
    canvas,
    ctx,
    [canvas.width * 0.5, canvas.height * 0.5],
    300,
    300,
    null,
    [152, 76],
    0,
    true
  );
  startButton.onClick(startGame);
  startButton.onHover(() => {
    //console.log("hover start")
  });

  infoButton = new Button(
    canvas,
    ctx,
    [canvas.width * 0.5 - 75, 50],
    150,
    70,
    "",
    [30, 80],
    0,
    false
  );
  infoButton.onClick(displayInfo);
  infoButton.onHover(() => {
    //console.log("hover start")
  });

  initParticles();

  moon = new Moon(
    rcCtx,
    rocketCanvas,
    moonPosition.x,
    moonPosition.y,
    "https://dl.dropbox.com/s/8rojntm6uvibmb6/moon.png"
  );
  rocket = new Rocket(
    rcCtx,
    rocketCanvas,
    rocketPosition.x,
    rocketPosition.y,
    5 / pointsTarget,
    "https://dl.dropbox.com/s/3mi3n6u6fkysr1y/rocket.png"
  );
  moon.init();
  rocket.init();
};

const updateParticles = () => {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
  }
};

const drawParticles = () => {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
  }
};
const drawBackround = () => {
  for (let i = 0; i < brnotes.length; i++) {
    brnotes[i].draw();
  }
}
const updateBackround = () => {
  for (let i = 0; i < brnotes.length; i++) {
    brnotes[i].update();
  }
}

const animationLoop = () => {
  clearCanvas(ctx, canvas);
  clearCanvas(rcCtx, rocketCanvas);
  rocket.update();
  updateBackround();  
  if (victoryAnimation) updateParticles();
  /*   clearCanvas(sdCtx, soundDebugCanvas); */
  moon.draw();
  rocket.draw();
  drawBackround();
  if (victoryAnimation) drawParticles();
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  
  
  
  
  startButton.draw();
  infoButton.draw();
  /*   drawAnalyser(soundDebugCanvas, sdCtx); */
  drawText(ctx, infoText, [canvas.width * 0.45, canvas.height * 0.12]);
  window.requestAnimationFrame(animationLoop);
};

init();
animationLoop();

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  rocketCanvas.height = window.innerHeight;
  rocketCanvas.width = window.innerWidth;
});
