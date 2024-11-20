// import { createIslandEvent } from "./utils.js";

export function initializeIslandEvent(tilePixelSize, baseScale) {
  const rowLength = 100;
  const islandEvent = splitArray(newIsland, rowLength);

  this.islandArea = this.physics.add.staticGroup();
  islandEvent.forEach((row, rowIndex) => {
    row.forEach((symbol, colIndex) => {
      if (symbol === 4098) {
        createIslandEvent.call(this, colIndex, rowIndex, tilePixelSize, baseScale);
      }
    });
  });
}

export function createIslandEvent(colIndex, rowIndex, tilePixelSize, baseScale) {
  const eventX = calculatePosition(colIndex, tilePixelSize, 6);
  const eventY = calculatePosition(rowIndex, tilePixelSize, 6);
  const event = this.physics.add.staticSprite(eventX, eventY);
  event.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
  event.setDisplaySize(12.5 * baseScale, 12.5 * baseScale);
  this.islandArea.add(event);
}
