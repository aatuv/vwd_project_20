class Moon {
  constructor(ctx, canvas, x, y, src) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.src = src;
    this.image = new Image();
    this.sound = new Audio(
      "https://dl.dropbox.com/s/ogob793xcqjrxq4/laser.wav"
    );
  }

  init() {
    this.image.src = this.src;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y);
  }
  playSound() {
    this.sound.play();
  }
}

class Rocket {
  constructor(ctx, canvas, x, y, speed, src) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.targetY = y;
    this.weight = -speed;
    this.src = src;
    this.image = new Image();
    this.sound = new Audio(
      "https://dl.dropbox.com/s/gegucqqi8kwrxvt/rocket.wav"
    );
  }

  init() {
    this.image.src = this.src;
  }

  update() {
    if (this.y > this.targetY) this.y += this.weight;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y);
  }
  playSound() {
    this.sound.play();
  }
}

class Particle {
  constructor(ctx, canvas, x, y) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.MIN_WEIGHT = 1.2;
    this.MAX_WEIGHT = 2.5;
    this.size = Math.random() * (3 - 1.5) + 1.5;
    this.weight =
      Math.random() * (this.MAX_WEIGHT - this.MIN_WEIGHT) + this.MIN_WEIGHT;
    this.directionX = Math.random() * (0.5 + 0.5) - 0.5;
  }

  update() {
    this.y += this.weight;
    this.x += this.directionX;
  }
  draw() {
    this.ctx.fillStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    //this.ctx.rect(this.x, this.y, this.size, this.size);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

export { Moon, Rocket, Particle };
