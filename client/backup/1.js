import preload from "./imports/preload.js";
import update from "./imports/update.js";

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 500,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  worldBounds: {
    x: 0,
    y: 0,
    width: 1366,
    height: 768,
  },
};

let isEnteringCave = false; // Flag to track if the player is trying to enter the cave
let isEnteringIsland = false;
function create() {
  const baseScale = 1;
  const tilePixelSize = 10;
  const displaySize = 12.5;
  const boundaryOffsetX = 6;
  const boundaryOffsetY = 6;
  const caveOffsetX = 6;
  const caveOffsetY = 6;
  const islandOffsetX = 6;
  const islandOffsetY = 6;

  const calculatePosition = (index, tileSize, offset) => {
    return index * tileSize * baseScale + offset;
  };

  // Background
  this.background = this.add.image(
    config.width / 2,
    config.height / 2,
    "background"
  );
  this.background.setScale(
    (config.width / this.background.width) * baseScale,
    (config.height / this.background.height) * baseScale
  );

  // Collision Map and Cave Event Array || New Island Event
  const rowLength = 100;
  const collisionMap = [];
  for (let i = 0; i < collision.length; i += rowLength) {
    collisionMap.push(collision.slice(i, i + rowLength));
  }

  const caveEvent = [];
  for (let i = 0; i < cave.length; i += rowLength) {
    caveEvent.push(cave.slice(i, i + rowLength));
  }

  const islandEvent = [];
  for (let i = 0; i < newIsland.length; i += rowLength) {
    islandEvent.push(newIsland.slice(i, i + rowLength));
  }

  // Boundaries Group
  this.boundaries = this.physics.add.staticGroup();

  collisionMap.forEach((row, rowIndex) => {
    row.forEach((symbol, colIndex) => {
      if (symbol === 4098) {
        const boundaryX = calculatePosition(
          colIndex,
          tilePixelSize,
          boundaryOffsetX
        );
        const boundaryY = calculatePosition(
          rowIndex,
          tilePixelSize,
          boundaryOffsetY
        );

        const boundary = this.physics.add.staticSprite(boundaryX, boundaryY);
        boundary.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
        boundary.setDisplaySize(
          displaySize * baseScale,
          displaySize * baseScale
        );
        this.boundaries.add(boundary);
      }
    });
  });

  // Cave Entrance Group
  this.caveArea = this.physics.add.staticGroup();

  caveEvent.forEach((row, rowIndex) => {
    row.forEach((symbol, colIndex) => {
      if (symbol === 4098) {
        const eventX = calculatePosition(colIndex, tilePixelSize, caveOffsetX);
        const eventY = calculatePosition(rowIndex, tilePixelSize, caveOffsetY);

        const event = this.physics.add.staticSprite(eventX, eventY);
        event.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
        event.setDisplaySize(displaySize * baseScale, displaySize * baseScale);
        this.caveArea.add(event);
      }
    });
  });

  this.islandArea = this.physics.add.staticGroup();

  islandEvent.forEach((row, rowIndex) => {
    row.forEach((symbol, colIndex) => {
      if (symbol === 4098) {
        const eventX = calculatePosition(colIndex, tilePixelSize, caveOffsetX);
        const eventY = calculatePosition(rowIndex, tilePixelSize, caveOffsetY);

        const event = this.physics.add.staticSprite(eventX, eventY);
        event.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
        event.setDisplaySize(displaySize * baseScale, displaySize * baseScale);
        this.islandArea.add(event);
      }
    });
  });

  // Player Setup
  const centerX = (rowLength * tilePixelSize * baseScale) / 2;
  const centerY = (collisionMap.length * tilePixelSize * baseScale) / 2;

  this.player = this.physics.add.sprite(centerX, centerY, "player");
  this.player.setDisplaySize(32 * baseScale, 32 * baseScale);
  this.player.setSize(15 * baseScale, 15 * baseScale);
  this.player.body.setOffset(40, 25);

  // Colliders
  this.physics.add.collider(this.player, this.boundaries);

  // Camera
  this.cameras.main.setBounds(
    0,
    0,
    this.background.displayWidth,
    this.background.displayHeight
  );
  this.cameras.main.startFollow(this.player);
  this.cameras.main.setZoom(1);
  this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
    this.cameras.main.zoom = Phaser.Math.Clamp(
      this.cameras.main.zoom + (deltaY < 0 ? 0.1 : -0.1),
      1,
      2
    );
  });

  // Player movement controls
  this.cursors = this.input.keyboard.createCursorKeys();

  // Cave Interaction Event with arrow function for proper context
  this.physics.add.overlap(
    this.player,
    this.caveArea,
    (player, cave) => {
      enterCave.call(this, player, cave); // Correct context using call()
    },
    null,
    this
  );

  this.physics.add.overlap(
    this.player,
    this.islandArea,
    (player, island) => {
      enterIsland.call(this, player, island); // Correct context using call()
    },
    null,
    this
  );
}

// Function to handle entering the cave
function enterCave(player, cave) {
  // Prevent multiple attempts to enter the cave
  if (isEnteringCave) {
    return;
  }

  // Set the flag to indicate the player is trying to enter
  isEnteringCave = true;

  // Display confirmation dialog
  const userConfirmed = confirm(
    "You are about to enter the cave! Do you want to proceed?"
  );

  if (userConfirmed) {
    console.log("Player has entered the cave!");
    // Switch scene or move player as needed
    this.scene.start("CaveScene"); // Example of transitioning to a new scene
  } else {
    console.log("Player canceled entering the cave.");
  }

  // Reset the flag after a slight delay to avoid immediate retriggering
  setTimeout(() => {
    isEnteringCave = false;
  }, 500); // Adjust the delay as necessary
}

function enterIsland(player, Island) {
  // Prevent multiple attempts to enter the cave
  if (isEnteringIsland) {
    return;
  }

  // Set the flag to indicate the player is trying to enter
  isEnteringIsland = true;

  // Display confirmation dialog
  const userConfirmed = confirm(
    "You are about to travel in new island! Do you want to proceed?"
  );

  if (userConfirmed) {
    console.log("Player has travelling to island!");
    // Switch scene or move player as needed
    this.scene.start("islandScene"); // Example of transitioning to a new scene
  } else {
    console.log("Player canceled did not start the journey.");
  }

  // Reset the flag after a slight delay to avoid immediate retriggering
  setTimeout(() => {
    isEnteringIsland = false;
  }, 500); // Adjust the delay as necessary
}
// Game Initialization
const game = new Phaser.Game(config);
