export function initializePlayer(tilePixelSize, baseScale) {
  const centerX = (100 * tilePixelSize * baseScale) / 2;
  const centerY = (collision.length * tilePixelSize * baseScale) / 2;

  this.player = this.physics.add.sprite(centerX, centerY, "player");
  this.player.setDisplaySize(32 * baseScale, 32 * baseScale);
  this.player.setSize(15 * baseScale, 15 * baseScale);
  this.player.body.setOffset(40, 25);
}
