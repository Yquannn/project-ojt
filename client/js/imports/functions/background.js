import { config } from "../client/index.js"; // Make sure the path is correct

export function initializeBackground(baseScale) {
  const { width, height } = config;

  // Add the background image to the center of the screen
  this.background = this.add.image(width / 2, height / 2, "background");

  // Scale the background image to fit the screen while maintaining aspect ratio
  const scaleX = (width / this.background.width) * baseScale;
  const scaleY = (height / this.background.height) * baseScale;

  this.background.setScale(scaleX, scaleY);
}
