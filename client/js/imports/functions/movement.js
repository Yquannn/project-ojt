export function moveToDestination() {
  if (destination) {
    const path = findPath(this.player.x, this.player.y, destination.x, destination.y);
    if (path && path.length > 0) {
      this.tweens.add({
        targets: this.player,
        x: path[path.length - 1].x,
        y: path[path.length - 1].y,
        duration: 1000,
        ease: "Linear",
        onComplete: () => {
          destination = null;
        },
      });
    }
  }
}
