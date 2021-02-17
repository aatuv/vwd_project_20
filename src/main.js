import { clearCanvas } from "./util.js";
import GameButton from "./button.js";

let canvas = document.getElementById("mainCanvas");
let hitcanvas=document.getElementById("hitCanvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var ctx = canvas.getContext("2d");
var hitCtx = hitcanvas.getContext("2d");
let buttons = [];
let hitbuttons=[];

// initialize canvas
const init = () => {
  let rotate = 0;
  for (let i = 0; i < 4; i++) {
    buttons.push(new GameButton(
      canvas,
      ctx,
      [canvas.width * 0.5, canvas.height * 0.5],
      300,
      300,
      null,
      [Math.random() * 100, Math.random() * 100],
      rotate
    ));
    buttons[i].onClick(() => {
      console.log("click");
    });
    buttons[i].onHover(() => {
      console.log("hover");
    });
    rotate += 90;
  }
};

const animationLoop = () => {
  clearCanvas(ctx, canvas);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  window.requestAnimationFrame(animationLoop);
};
init();
animationLoop();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
