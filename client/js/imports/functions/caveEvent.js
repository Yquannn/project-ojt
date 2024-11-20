// import { createCaveEvent } from "./utils.js";

export function initializeCaveEvent(tilePixelSize, baseScale) {
  const rowLength = 100;
  const caveEvent = splitArray(cave, rowLength);

  this.caveArea = this.physics.add.staticGroup();
  caveEvent.forEach((row, rowIndex) => {
    row.forEach((symbol, colIndex) => {
      if (symbol === 4098) {
        createCaveEvent.call(this, colIndex, rowIndex, tilePixelSize, baseScale);
      }
    });
  });
}

export function createCaveEvent(colIndex, rowIndex, tilePixelSize, baseScale) {
  const eventX = calculatePosition(colIndex, tilePixelSize, 6);
  const eventY = calculatePosition(rowIndex, tilePixelSize, 6);
  const event = this.physics.add.staticSprite(eventX, eventY);
  event.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
  event.setDisplaySize(12.5 * baseScale, 12.5 * baseScale);
  this.caveArea.add(event);
}
