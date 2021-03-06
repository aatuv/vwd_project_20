import {
  gameButtonIsIntersecting,
  startButtonIsIntersecting,
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
    rotateDegrees,
    playicon
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
    this.playicon = playicon;
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
        !this.isDisabled && callback();
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
        if (!this.isDisabled) {
          this.color = hslColor(this.colorTint[0], this.colorTint[1], 30);
          callback();
        }
      } else {
        this.isHovered = false;
        if (!this.isDisabled) {
          this.color = hslColor(this.colorTint[0], this.colorTint[1], 50);
        }
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
    if (this.playicon) {
      this.context.fillStyle = "rgb(0,100,0)";
      this.context.beginPath();
      this.context.moveTo(this.location[0], this.location[1]);
      this.context.lineTo(this.location[0], this.location[1]);
      this.context.lineTo(this.location[0], this.location[1]);
      this.context.lineTo(this.location[0], this.location[1]);
      this.context.fill();
      this.context.font = "25px Arial Black";
      this.context.fillStyle = "rgb(0,0,0)";
      this.context.fillText(
        this.text,
        this.location[0] + this.width * 0.5 - 50,
        this.location[1] + this.height * 0.6,
        100
      );
    } else {
      this.context.fillStyle = "rgb(0,0,100)";
      this.context.beginPath();
      this.context.arc(
        this.location[0] + this.width * 0.5,
        this.location[1] + 35,
        20,
        0,
        2 * Math.PI
      );
      this.context.fill();
      this.context.font = "30px Times New Roman";
      this.context.fillStyle = "rgb(255,255,255)";
      this.context.fillText(
        "i",
        this.location[0] + this.width * 0.5 - 5,
        this.location[1] + this.height * 0.65,
        100
      );
      this.context.stroke();
      this.context.font = "25px Arial Black";
      this.context.fillStyle = "rgb(0,0,0)";
      this.context.fillText(
        this.text,
        this.location[0] + this.width * 0.5 - 50,
        this.location[1] + this.height * 0.6,
        200
      );
    }
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
    rotateDegrees,
    note
  ) {
    super(canvas, context, location, width, height, text, color, rotateDegrees);
    this.radius = this.width * 0.5;
    this.note = note;
    this.isPlayingSound = false;
  }

  onClick(callback) {
    this.canvas.addEventListener("click", (event) => {
      // mouseposition relative to the window
      const mousePosition = {
        x: event.clientX - this.canvas.offsetLeft,
        y: event.clientY - this.canvas.offsetTop,
      };
      if (gameButtonIsIntersecting(mousePosition, this, this.rotateDegrees)) {
        !this.isDisabled && callback();
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
        this.isHovered = true;
        if (!this.isDisabled) {
          this.color = hslColor(this.colorTint[0], this.colorTint[1], 30);
          callback();
        }
      } else {
        this.isHovered = false;
        if (!this.isDisabled) {
          this.color = hslColor(this.colorTint[0], this.colorTint[1], 50);
        }
      }
    });
  }

  lightUp(time) {
    this.color = hslColor(this.colorTint[0], this.colorTint[1], 50);
    setTimeout(() => {
      this.color = hslColor(this.colorTint[0], this.colorTint[1], 20);
    }, time);
  }

  dim() {
    this.color = hslColor(this.colorTint[0], this.colorTint[1], 20);
  }

  draw() {
    if (this.isDisabled && !this.isPlayingSound)
      this.color = hslColor(this.colorTint[0], this.colorTint[1], 20);
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

class StartButton extends Button {
  constructor(
    canvas,
    context,
    location,
    width,
    height,
    text,
    color,
    rotateDegrees,
    playicon
  ) {
    super(
      canvas,
      context,
      location,
      width,
      height,
      text,
      color,
      rotateDegrees,
      playicon
    );
    this.radius = this.width * 0.5;
  }

  onClick(callback) {
    this.canvas.addEventListener("click", (event) => {
      // mouseposition relative to the window
      const mousePosition = {
        x: event.clientX - this.canvas.offsetLeft,
        y: event.clientY - this.canvas.offsetTop,
      };
      if (startButtonIsIntersecting(mousePosition, this) && !this.isDisabled) {
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
      if (startButtonIsIntersecting(mousePosition, this)) {
        this.isHovered = true;
        if (!this.isDisabled) {
          this.color = hslColor(this.colorTint[0], this.colorTint[1], 30);
          callback();
        }
      } else {
        this.isHovered = false;
        if (!this.isDisabled) {
          this.color = hslColor(this.colorTint[0], this.colorTint[1], 50);
        }
      }
    });
  }

  lightUp(time) {
    this.color = hslColor(this.colorTint[0], this.colorTint[1], 50);
    setTimeout(() => {
      this.color = hslColor(this.colorTint[0], this.colorTint[1], 20);
    }, time);
  }

  dim() {
    this.color = hslColor(this.colorTint[0], this.colorTint[1], 20);
  }

  draw() {
    this.context.beginPath();
    this.context.save();
    this.context.translate(this.location[0], this.location[1]);
    this.context.rotate(degreesToRadians(this.rotateDegrees));
    this.context.fillStyle = this.color;
    this.context.strokeStyle = this.color;
    this.context.arc(0, 0, this.radius, 0, Math.PI * 2);
    this.context.fill();
    // this.context.stroke();
    this.context.closePath();
    this.context.fillStyle = "hsl(286, 76%, 48%)";
    this.context.beginPath();
    this.context.moveTo(-55, -65);
    this.context.lineTo(75, 0);
    this.context.lineTo(-55, 65);
    this.context.fill();
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
export { Button, GameButton, StartButton };
