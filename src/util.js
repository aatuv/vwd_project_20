const clearCanvas = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

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

const hslColor = (hue, saturation, lightness) => {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

export { clearCanvas, isIntersecting, hslColor, degreesToRadians };
