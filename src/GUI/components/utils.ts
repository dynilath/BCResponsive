export function calculatePositionStyle(
  canvasPosition: Position,
  position: Position
) {
  const ratio = canvasPosition.width / 2000;

  const style = {
    position: "fixed",
    left: `${canvasPosition.x + position.x * ratio}px`,
    top: `${canvasPosition.y + position.y * ratio}px`,
    width: `${position.width * ratio}px`,
    height: `${position.height * ratio}px`,
  };

  return style;
}
