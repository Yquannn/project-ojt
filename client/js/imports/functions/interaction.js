export function enterCave(player, cave) {
  if (isEnteringCave) return;

  isEnteringCave = true;
  const userConfirmed = confirm("You are about to enter the cave! Do you want to proceed?");
  if (userConfirmed) {
    console.log("Player has entered the cave!");
    this.scene.start("CaveScene");
  } else {
    console.log("Player canceled entering the cave.");
  }

  setTimeout(() => { isEnteringCave = false; }, 500);
}

export function enterIsland(player, island) {
  if (isEnteringIsland) return;

  isEnteringIsland = true;
  const userConfirmed = confirm("You are about to travel to a new island! Do you want to proceed?");
  if (userConfirmed) {
    console.log("Player has traveled to the island!");
    this.scene.start("IslandScene");
  } else {
    console.log("Player canceled traveling to the island.");
  }

  setTimeout(() => { isEnteringIsland = false; }, 500);
}
