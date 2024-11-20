import { moveToDestination } from "./movement.js";

export function setupInput() {
  this.input.on("pointerdown", (pointer) => {
    destination = { x: pointer.x, y: pointer.y };
    moveToDestination.call(this);
  });

  this.cursors = this.input.keyboard.createCursorKeys();
}
