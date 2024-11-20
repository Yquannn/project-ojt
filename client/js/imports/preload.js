export default function preload() {
  // Correct path for the background image
  this.load.image("background", "assets/starting area.png");

  // Correct path for the player sprite sheet
  this.load.spritesheet(
    "player",
    "assets/Sunnyside_World_Assets/Characters/Human/WALKING/base_walk_strip8.png",
    { frameWidth: 64, frameHeight: 64 }
  );
}
