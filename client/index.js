// // import preload from "./js/imports/preload.js";
// // import update from "./js/imports/update.js";

// const config = {
//   type: Phaser.AUTO,
//   width: 1000,
//   height: 500,
//   parent: "game-container",
//   physics: {
//     default: "arcade",
//     arcade: {
//       gravity: { y: 0 },
//       debug: true,
//     },
//   },
//   scene: {
//     preload: preload,
//     create: create,
//     update: update,
//   },
//   worldBounds: {
//         x: 0,
//         y: 0,
//         width: 2000,
//         height: 1000,
//       },
// };

// function preload() {
//   // Correct path for the background image
//   this.load.image("background", "assets/starting area.png");

//   // Correct path for the player sprite sheet
//   this.load.spritesheet(
//     "player",
//     "assets/Sunnyside_World_Assets/Characters/Human/WALKING/base_walk_strip8.png",
//     { frameWidth: 64, frameHeight: 64 }
//   );
// }

// let isEnteringCave = false; // Flag to track if the player is trying to enter the cave
// let isEnteringIsland = false;
// let destination = null; // To track the destination of the player

// function create() {
//   const baseScale = 1;
//   const tilePixelSize = 10;
//   const displaySize = 12.5;
//   const boundaryOffsetX = 6;
//   const boundaryOffsetY = 6;
//   const caveOffsetX = 6;
//   const caveOffsetY = 6;
//   const islandOffsetX = 6;
//   const islandOffsetY = 6;

//   const calculatePosition = (index, tileSize, offset) => {
//     return index * tileSize * baseScale + offset;
//   };

//   // Background
//   this.background = this.add.image(
//     config.width / 2,
//     config.height / 2,
//     "background"
//   );
//   this.background.setScale(
//     (config.width / this.background.width) * baseScale,
//     (config.height / this.background.height) * baseScale
//   );

//   // Collision Map and Cave Event Array || New Island Event
//   const rowLength = 100;
//   const collisionMap = [];
//   for (let i = 0; i < collision.length; i += rowLength) {
//     collisionMap.push(collision.slice(i, i + rowLength));
//   }

//   const caveEvent = [];
//   for (let i = 0; i < cave.length; i += rowLength) {
//     caveEvent.push(cave.slice(i, i + rowLength));
//   }

//   const islandEvent = [];
//   for (let i = 0; i < newIsland.length; i += rowLength) {
//     islandEvent.push(newIsland.slice(i, i + rowLength));
//   }

//   // Boundaries Group
//   this.boundaries = this.physics.add.staticGroup();

//   collisionMap.forEach((row, rowIndex) => {
//     row.forEach((symbol, colIndex) => {
//       if (symbol === 4098) {
//         const boundaryX = calculatePosition(
//           colIndex,
//           tilePixelSize,
//           boundaryOffsetX
//         );
//         const boundaryY = calculatePosition(
//           rowIndex,
//           tilePixelSize,
//           boundaryOffsetY
//         );

//         const boundary = this.physics.add.staticSprite(boundaryX, boundaryY);
//         boundary.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
//         boundary.setDisplaySize(
//           displaySize * baseScale,
//           displaySize * baseScale
//         );
//         this.boundaries.add(boundary);
//       }
//     });
//   });

//   // Cave Entrance Group
//   this.caveArea = this.physics.add.staticGroup();

//   caveEvent.forEach((row, rowIndex) => {
//     row.forEach((symbol, colIndex) => {
//       if (symbol === 4098) {
//         const eventX = calculatePosition(colIndex, tilePixelSize, caveOffsetX);
//         const eventY = calculatePosition(rowIndex, tilePixelSize, caveOffsetY);

//         const event = this.physics.add.staticSprite(eventX, eventY);
//         event.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
//         event.setDisplaySize(displaySize * baseScale, displaySize * baseScale);
//         this.caveArea.add(event);
//       }
//     });
//   });

//   this.islandArea = this.physics.add.staticGroup();

//   islandEvent.forEach((row, rowIndex) => {
//     row.forEach((symbol, colIndex) => {
//       if (symbol === 4098) {
//         const eventX = calculatePosition(colIndex, tilePixelSize, caveOffsetX);
//         const eventY = calculatePosition(rowIndex, tilePixelSize, caveOffsetY);

//         const event = this.physics.add.staticSprite(eventX, eventY);
//         event.setSize(tilePixelSize * baseScale, tilePixelSize * baseScale);
//         event.setDisplaySize(displaySize * baseScale, displaySize * baseScale);
//         this.islandArea.add(event);
//       }
//     });
//   });

//   // Player Setup
//   const centerX = (rowLength * tilePixelSize * baseScale) / 2;
//   const centerY = (collisionMap.length * tilePixelSize * baseScale) / 2;

//   this.player = this.physics.add.sprite(centerX, centerY, "player");
//   this.player.setDisplaySize(32 * baseScale, 32 * baseScale);
//   this.player.setSize(15 * baseScale, 15 * baseScale);
//   this.player.body.setOffset(40, 25);

//   // Colliders
//   this.physics.add.collider(this.player, this.boundaries);

//   // Camera
//   this.cameras.main.setBounds(
//     0,
//     0,
//     this.background.displayWidth,
//     this.background.displayHeight
//   );
//   this.cameras.main.startFollow(this.player);
//   this.cameras.main.setZoom(1);
//   this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
//     this.cameras.main.zoom = Phaser.Math.Clamp(
//       this.cameras.main.zoom + (deltaY < 0 ? 0.1 : -0.1),
//       1,
//       2
//     );
//   });

//   // Listen for click events on the game area
//   this.input.on('pointerdown', (pointer) => {
//     const x = pointer.x;
//     const y = pointer.y;

//     // Set the destination for the player
//     destination = { x, y };

//     // Optionally, start moving towards that point
//     moveToDestination.call(this);
//   });

//   // Player movement controls
//   this.cursors = this.input.keyboard.createCursorKeys();

//   // Cave Interaction Event
//   this.physics.add.overlap(
//     this.player,
//     this.caveArea,
//     (player, cave) => {
//       enterCave.call(this, player, cave); // Correct context using call()
//     },
//     null,
//     this
//   );

//   this.physics.add.overlap(
//     this.player,
//     this.islandArea,
//     (player, island) => {
//       enterIsland.call(this, player, island); // Correct context using call()
//     },
//     null,
//     this
//   );
// }


// function moveToDestination() {
//   if (destination) {
//     const path = findPath(this.player.x, this.player.y, destination.x, destination.y);

//     // Animate the player along the path (simple movement along the points in the path)
//     if (path && path.length > 0) {
//       this.tweens.add({
//         targets: this.player,
//         x: path[path.length - 1].x,
//         y: path[path.length - 1].y,
//         // duration: 10, // Duration of movement
//         ease: 'Linear',
//         onComplete: () => {
//           // Once the player reaches the destination, clear destination
//           destination = null;
//         },
//       });
//     }
//   }
// }



// // to be fix


// function findPath(startX, startY, endX, endY) {
//   // Implement a simple pathfinding method here (you can use A* or any other method)
//   // For now, we'll just create a path that connects the start and end points
//   // You can expand this to use more advanced pathfinding if needed

//   const path = [];
//   let currentX = startX;
//   let currentY = startY;

//   // Example of basic straight-line path (you can replace with A* or other pathfinding)
//   while (currentX !== endX || currentY !== endY) {
//     if (currentX < endX) currentX++;
//     if (currentX > endX) currentX--;
//     if (currentY < endY) currentY++;
//     if (currentY > endY) currentY--;
    
//     path.push({ x: currentX, y: currentY });
//   }

//   return path;
// }



// function update(time, delta) {
//   if (this.isMoving && this.targetPosition) {
//     const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.targetPosition.x, this.targetPosition.y);
//     if (distance < 5) {
//       this.isMoving = false;
//       this.targetPosition = null;
//     } else {
//       const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.targetPosition.x, this.targetPosition.y);
//       const velocityX = Math.cos(angle) * this.speed;
//       const velocityY = Math.sin(angle) * this.speed;
//       this.player.setVelocity(velocityX, velocityY);
//     }
//   } else {
//     this.player.setVelocity(0);
//   }
// }


// function enterCave(player, cave) {
//   if (isEnteringCave) {
//     return;
//   }

//   isEnteringCave = true;
//   const userConfirmed = confirm("You are about to enter the cave! Do you want to proceed?");

//   if (userConfirmed) {
//     console.log("Player has entered the cave!");
//     this.scene.start("CaveScene");
//   } else {
//     console.log("Player canceled entering the cave.");
//   }

//   setTimeout(() => {
//     isEnteringCave = false;
//   }, 500);
// }

// function enterIsland(player, island) {
//   if (isEnteringIsland) {
//     return;
//   }

//   isEnteringIsland = true;
//   const userConfirmed = confirm("You are about to travel in new island! Do you want to proceed?");


//   if (userConfirmed) {
//     console.log("Player has traveling to island!");
//     this.scene.start("islandScene");
//   } else {
//     console.log("Player canceled did not start the journey.");
//   }


//   setTimeout(() => {
//     isEnteringIsland = false;
//   }, 500);
// }

// const game = new Phaser.Game(config);


// import preload from "./js/imports/preload.js";
// import update from "./js/imports/update.js";
// import create from "./js/imports/create.js"; // New import for create function


import MyGame from './js/imports/MyGame.js';

const config = {
  type: Phaser.AUTO,
  width: 2000,
  height: 1000,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: MyGame,
  worldBounds: {
    x: 0,
    y: 0,
    width: 2000,
    height: 1000,
  },
};

const game = new Phaser.Game(config);


// const config = {
//   type: Phaser.AUTO,
//   width: 800,
//   height: 600,
//   scene: MyGame,
//   physics: {
//     default: 'arcade',
//     arcade: {
//       gravity: { y: 0 },
//       debug: true,
//     }
//   }
// };

// const game = new Phaser.Game(config);

