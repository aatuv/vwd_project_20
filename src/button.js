import {
  gameButtonIsIntersecting,
  isIntersecting,
  hslColor,
  degreesToRadians,
} from "./util.js";

// basic button
class Button {
  constructor(
    canvas,
    context,
    location,
    width,
    height,
    text,
    color,
    rotateDegrees
  ) {
    this.context = context;
    this.canvas = canvas;
    this.location = location;
    this.width = width;
    this.height = height;
    this.text = text;
    this.isDisabled = false;
    this.isHovered = false;
    this.rotateDegrees = rotateDegrees;
    this.colorTint = color; // saving the original color settings to make adjusting the color brightness easier
    this.color = hslColor(color[0], color[1], 50); // [hue, sat]
  }

  get top() {
    return this.location[1];
  }
  get bottom() {
    return this.location[1] + this.height;
  }
  get left() {
    return this.location[0];
  }
  get right() {
    return this.location[0] + this.width;
  }

  onClick(callback) {
    this.canvas.addEventListener("click", (event) => {
      // mouseposition relative to the window
      const mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      if (isIntersecting(mousePosition, this)) {
        callback();
      }
    });
  }
  onHover(callback) {
    this.canvas.addEventListener("mousemove", (event) => {
      // mouseposition relative to the window
      const mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      if (isIntersecting(mousePosition, this)) {
        this.isHovered = true;
        this.color = hslColor(this.colorTint[0], this.colorTint[1], 30);
        callback();
      } else {
        this.isHovered = false;
        this.color = hslColor(this.colorTint[0], this.colorTint[1], 50);
      }
    });
  }

  draw() {
    this.context.fillStyle = this.color;
    this.context.fillRect(
      this.location[0],
      this.location[1],
      this.width,
      this.height
    );
    this.context.font = "20px Georgia";
    this.context.fillStyle = "rgb(0,0,0)";
    this.context.fillText(this.text, this.location[0]+this.width* 0.25, this.location[1] + this.height * 0.5 , this.width);
  }
}

// the "circular" buttons for the game
class GameButton extends Button {
  constructor(
    canvas,
    context,
    location,
    width,
    height,
    text,
    color,
    rotateDegrees
  ) {
    super(canvas, context, location, width, height, text, color, rotateDegrees);
    this.radius = this.width * 0.5;
  }

  onClick(callback) {
    this.canvas.addEventListener("click", (event) => {
      // mouseposition relative to the window
      const mousePosition = {
        x: event.clientX - this.canvas.offsetLeft,
        y: event.clientY - this.canvas.offsetTop,
      };
      if (gameButtonIsIntersecting(mousePosition, this, this.rotateDegrees)) {
        callback();
      }
    });
  }

  onHover(callback) {
    this.canvas.addEventListener("mousemove", (event) => {
      // mouseposition relative to the window
      const mousePosition = {
        x: event.clientX - this.canvas.offsetLeft,
        y: event.clientY - this.canvas.offsetTop,
      };
      if (gameButtonIsIntersecting(mousePosition, this, this.rotateDegrees)) {
        this.color = hslColor(this.colorTint[0], this.colorTint[1], 30);
        this.isHovered = true;
        callback();
      } else {
        this.isHovered = false;
        this.color = hslColor(this.colorTint[0], this.colorTint[1], 50);
      }
    });
  }

  draw() {
    this.context.beginPath();
    this.context.save();
    this.context.translate(this.location[0], this.location[1]);
    this.context.rotate(degreesToRadians(this.rotateDegrees));
    this.context.fillStyle = this.color;
    this.context.strokeStyle = this.color;
    this.context.arc(0, 0, this.radius, 0, 0.5 * Math.PI);
    this.context.lineTo(0, this.radius * 2);
    this.context.arc(
      0,
      0,
      this.radius * 2,
      degreesToRadians(90),
      0 * Math.PI,
      true
    );
    this.context.lineTo(this.radius, 0);
    this.context.fill();
    //this.context.stroke();
    this.context.closePath();
    if (this.text) {
      this.context.fillStyle = hslColor(1, 1, 0);
      this.context.font = "20px Georgia";
      this.context.fillText(
        this.text,
        this.location[0] + this.width * 0.25,
        this.location[1] + this.height * 0.25
      );
    }
    this.context.restore();
  }

  update() {}
}
//export{startButton};
export { Button, GameButton };
