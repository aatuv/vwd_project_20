const clearCanvas = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// for square buttons
const isIntersecting = (xyPos, canvasElement) => {
  if (
    xyPos.x < canvasElement.left ||
    xyPos.x > canvasElement.right ||
    xyPos.y < canvasElement.top ||
    xyPos.y > canvasElement.bottom
  ) {
    return false;
  }
  return true;
};

// for game buttons
const gameButtonIsIntersecting = (xyPos, canvasElement, rotateDegrees) => {
  let distance;
  switch (rotateDegrees) {
    case 90:
      // mouse pointer distance from the middle
      distance = Math.sqrt(xyPos.x * xyPos.x + xyPos.y * xyPos.y);
      if (
        xyPos.x < 0 &&
        xyPos.y > 0 &&
        distance >= canvasElement.radius &&
        distance <= canvasElement.radius * 2
      ) {
        return true;
      }
      return false;
    case 180:
      // mouse pointer distance from the middle
      distance = Math.sqrt(xyPos.x * xyPos.x + xyPos.y * xyPos.y);
      if (
        xyPos.x < 0 &&
        xyPos.y < 0 &&
        distance >= canvasElement.radius &&
        distance <= canvasElement.radius * 2
      ) {
        return true;
      }
      return false;
    case 270:
      // mouse pointer distance from the middle
      distance = Math.sqrt(xyPos.x * xyPos.x + xyPos.y * xyPos.y);
      if (
        xyPos.x > 0 &&
        xyPos.y < 0 &&
        distance >= canvasElement.radius &&
        distance <= canvasElement.radius * 2
      ) {
        return true;
      }
      return false;
    default:
      // mouse pointer distance from the middle
      distance = Math.sqrt(xyPos.x * xyPos.x + xyPos.y * xyPos.y);
      if (
        xyPos.x > 0 &&
        xyPos.y > 0 &&
        distance >= canvasElement.radius &&
        distance <= canvasElement.radius * 2
      ) {
        return true;
      }
      return false;
  }
};

const startButtonIsIntersecting = (xyPos, canvasElement) => {
  const distance = Math.sqrt(xyPos.x * xyPos.x + xyPos.y * xyPos.y);
  if (
    distance <= canvasElement.radius &&
    distance <= canvasElement.radius * 2
  ) {
    return true;
  }
  return false;
}

// return a hsl color with specified parameters
const hslColor = (hue, saturation, lightness) => {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const drawText = (ctx, text, position, fontSize, maxWidth) => {
  ctx.fillStyle = "white";
  ctx.font = fontSize ? `${fontSize}px Consolas` : "24px Consolas";
  ctx.fillText(text, position[0], position[1], maxWidth);
};

const displayInfo = () => {
  let info = document.getElementById("info");
  let infoStyle = window.getComputedStyle(info);
  let displayState = infoStyle.getPropertyValue("top");
  switch (displayState) {
    case "500px":
      info.style.top = "-500px";
      break;
    default:
      info.style.top = "500px";
      break;
  }
};

export {
  clearCanvas,
  isIntersecting,
  gameButtonIsIntersecting,
  startButtonIsIntersecting,
  hslColor,
  degreesToRadians,
  drawText,
  displayInfo,
};
