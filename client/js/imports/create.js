import { Vec2 } from './controllers/linAlg.js'; // Import Vec2 class if required
// import { collision, cave, newIsland } from './assets/levelData.js'; // Ensure level data is properly imported

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: 'MyGame' });
    this.boundaries = new Set();
    this.path = [];
    this.currentPathIndex = 0;
    this.pathGroup = null;
    this.isMoving = false;
    this.targetPosition = null;
    this.speed = 100;
    this.isEnteringCave = false;
    this.isEnteringIsland = false;
  }

  preload() {
    // Correct path for the background image
    this.load.image("background", "assets/starting area.png");

    // Correct path for the player sprite sheet
    this.load.spritesheet(
      "player",
      "assets/Sunnyside_World_Assets/Characters/Human/WALKING/base_walk_strip8.png",
      { frameWidth: 64, frameHeight: 64 }
    );
  }

  create() {
    const baseScale = 1;
    const tilePixelSize = 20.1;
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

    // Background setup
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    this.background = this.add.image(gameWidth / 2, gameHeight / 2, "background");
    this.background.setOrigin(0.5, 0.5);
    this.background.setScale(
      (gameWidth / this.background.width) * baseScale,
      (gameHeight / this.background.height) * baseScale
    );

    // Setup collision, cave, and island areas
    const rowLength = 100;
    const collisionMap = [];
    const caveEvent = [];
    const islandEvent = [];

    // Split collision data into rows
    for (let i = 0; i < collision.length; i += rowLength) {
      collisionMap.push(collision.slice(i, i + rowLength));
    }

    for (let i = 0; i < cave.length; i += rowLength) {
      caveEvent.push(cave.slice(i, i + rowLength));
    }

    for (let i = 0; i < newIsland.length; i += rowLength) {
      islandEvent.push(newIsland.slice(i, i + rowLength));
    }

    // Boundaries Group
    this.boundaries = this.physics.add.staticGroup();
    collisionMap.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        if (symbol === 4098) {
          const boundaryX = calculatePosition(colIndex, tilePixelSize, boundaryOffsetX);
          const boundaryY = calculatePosition(rowIndex, tilePixelSize, boundaryOffsetY);
          const boundary = this.physics.add.staticSprite(boundaryX, boundaryY);
          boundary.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
          boundary.setDisplaySize(displaySize * baseScale, displaySize * baseScale);
          this.boundaries.add(boundary);
        }
      });
    });

    // Cave Area Group
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

    // Island Area Group
    this.islandArea = this.physics.add.staticGroup();
    islandEvent.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        if (symbol === 4098) {
          const eventX = calculatePosition(colIndex, tilePixelSize, islandOffsetX);
          const eventY = calculatePosition(rowIndex, tilePixelSize, islandOffsetY);
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

    // Cave Interaction Event
    this.physics.add.overlap(
      this.player,
      this.caveArea,
      (player, cave) => {
        this.enterCave(player, cave);
      },
      null,
      this
    );

    // Island Interaction Event
    this.physics.add.overlap(
      this.player,
      this.islandArea,
      (player, island) => {
        this.enterIsland(player, island);
      },
      null,
      this
    );
  }

  // Methods for cave and island interaction
  enterCave(player, cave) {
    this.isEnteringCave = true;
    console.log("Entering cave");
  }

  enterIsland(player, island) {
    this.isEnteringIsland = true;
    console.log("Entering island");
  }
}

export default MyGame;
