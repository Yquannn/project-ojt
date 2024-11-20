import { splitArray } from "../utils/utils.js";
// import { createBoundary } from "../utils/utils.js";

export function initializeCollisionMap(tilePixelSize, baseScale) {
  const rowLength = 100;
  const collisionMap = splitArray(collision, rowLength);
  this.boundaries = this.physics.add.staticGroup();

  collisionMap.forEach((row, rowIndex) => {
    row.forEach((symbol, colIndex) => {
      if (symbol === 4098) {
        createBoundary.call(this, colIndex, rowIndex, tilePixelSize, baseScale);
      }
    });
  });
}

export function createBoundary(colIndex, rowIndex, tilePixelSize, baseScale) {
  const boundaryX = calculatePosition(colIndex, tilePixelSize, 6);
  const boundaryY = calculatePosition(rowIndex, tilePixelSize, 6);
  const boundary = this.physics.add.staticSprite(boundaryX, boundaryY);
  boundary.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
  boundary.setDisplaySize(12.5 * baseScale, 12.5 * baseScale);
  this.boundaries.add(boundary);
}
