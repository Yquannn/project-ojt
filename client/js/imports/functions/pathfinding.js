export function findPath(startX, startY, endX, endY) {
  const path = [];
  let currentX = startX;
  let currentY = startY;

  while (currentX !== endX || currentY !== endY) {
    if (currentX < endX) currentX++;
    if (currentX > endX) currentX--;
    if (currentY < endY) currentY++;
    if (currentY > endY) currentY--;
    path.push({ x: currentX, y: currentY });
  }

  return path;
}
