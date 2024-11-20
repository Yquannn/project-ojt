export function setupCamera() {
  this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
  this.cameras.main.startFollow(this.player);
  this.cameras.main.setZoom(1);
  this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
    this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom + (deltaY < 0 ? 0.1 : -0.1), 1, 2);
  });
}
