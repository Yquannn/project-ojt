import { enterCave, enterIsland } from "./interaction.js";

export function setupColliders() {
  this.physics.add.collider(this.player, this.boundaries);
  this.physics.add.overlap(this.player, this.caveArea, (player, cave) => enterCave.call(this, player, cave), null, this);
  this.physics.add.overlap(this.player, this.islandArea, (player, island) => enterIsland.call(this, player, island), null, this);
}
