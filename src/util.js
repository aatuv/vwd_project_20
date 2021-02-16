const clearCanvas = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// for square buttons
const isIntersecting = (xyPos, canvasElement, rotateDegrees) => {
  switch (rotateDegrees) {
    case 90:
      if (
        xyPos.x > 0 ||
        xyPos.x < -canvasElement.width ||
        xyPos.y < 0 ||
        xyPos.y > canvasElement.height
      ) {
        return false;
      }
      return true;
    case 180:
      if (
        xyPos.x > 0 ||
        xyPos.x < -canvasElement.width ||
        xyPos.y < -canvasElement.height ||
        xyPos.y > 0
      ) {
        return false;
      }
      return true;
    case 270:
      if (
        xyPos.x > canvasElement.width ||
        xyPos.x < 0 ||
        xyPos.y < -canvasElement.height ||
        xyPos.y > 0
      ) {
        return false;
      }
      return true;
    default:
      if (
        xyPos.x > canvasElement.width ||
        xyPos.x < 0 ||
        xyPos.y < 0 ||
        xyPos.y > canvasElement.height
      ) {
        return false;
      }
      return true;
  }
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

const hslColor = (hue, saturation, lightness) => {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

export {
  clearCanvas,
  isIntersecting,
  gameButtonIsIntersecting,
  hslColor,
  degreesToRadians,
};
