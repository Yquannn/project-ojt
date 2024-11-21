import findShortestPath from '../imports/controllers/pathFindings.js'; // Import pathfinding
import { Vec2 } from './controllers/linAlg.js';
import { createPlayerAnimations } from './animation/playerAnimation.js'; // Import the animation module

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: 'MyGame' });
    this.boundaries = new Set(); // Set to hold non-walkable tiles
    this.tileSize = 20; // Tile size in pixels
    this.path = []; // To store the calculated path
    this.currentPathIndex = 0; // To track current position in the path
    this.isMoving = false;
    this.speed = 50; // Speed of the player
    this.chopping = false; // To prevent chopping while already chopping
    this.chopTimer = null; // To manage the timer
    this.timerText = null; // To display the timer
    this.isAutomated = false;
  }

  preload() {
    // Load assets
    this.load.image('background', 'assets/bg.jpg');
    this.load.spritesheet('player', 'assets/Player.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('obstacle', 'assets/Obstacle.png');
  }

  create() {
    const baseScale = 1.5;
    const tilePixelSize = this.tileSize;
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Background setup
    this.background = this.add.image(gameWidth / 2, gameHeight / 2, 'background');
    this.background.setOrigin(0.5, 0.5);
    this.background.setScale(
      gameWidth / this.background.width,
      gameHeight / this.background.height
    );

    createPlayerAnimations(this); // Initialize animations

    // Prepare collision and starting areas
    const rowLength = 100; // Length of a row in the collision data
    const collisionMap = [];
    const beginningArea = [];

    for (let i = 0; i < PlayerStartingPosition.length; i += rowLength) {
      beginningArea.push(PlayerStartingPosition.slice(i, i + rowLength));
    }

    for (let i = 0; i < collision.length; i += rowLength) {
      collisionMap.push(collision.slice(i, i + rowLength));
    }

    // Create obstacles for collision map
    this.createObstacles(collisionMap);

    // Get a valid starting position
    const startPos = this.startingPosition(beginningArea);

    // Convert starting position to pixel coordinates
    const startX = startPos.x * this.tileSize + this.tileSize / 2;
    const startY = startPos.y * this.tileSize + this.tileSize / 2;

    // Player setup
    this.player = this.physics.add.sprite(startX, startY, 'player');
    this.player.setSize(this.tileSize, this.tileSize);
    this.player.setOffset(10, 0);
    const scaleFactor = 1;
    this.player.setScale(scaleFactor);
    this.player.setCollideWorldBounds(true);

    // Collision between player and boundaries
    this.physics.add.collider(this.player, this.boundaries);

    // Camera setup
    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
    this.cameras.main.startFollow(this.player);

    // Input handling for pathfinding
    this.input.on('pointerdown', (pointer) => {
      const target = this.getClickedPosition(pointer);
      const start = new Vec2(
        Math.floor(this.player.x / this.tileSize),
        Math.floor(this.player.y / this.tileSize)
      );

      // Find the shortest path using A* algorithm
      this.path = findShortestPath(start, target, this.boundaries);
      this.currentPathIndex = 0;
      this.isMoving = this.path && this.path.length > 0;

      console.log(this.isMoving ? 'Path found!' : 'No path found');
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createObstacles(area) {
    area.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        // Iterate through each column in the row
        if (symbol === 4098) {
          // Boundary symbol (adjust based on your map)
          const boundaryX = colIndex * this.tileSize + this.tileSize / 2;
          const boundaryY = rowIndex * this.tileSize + this.tileSize / 2;
          const obstacle = this.physics.add.staticImage(boundaryX, boundaryY, 'obstacle');
          obstacle.setDisplaySize(this.tileSize, this.tileSize);
          obstacle.setVisible(false);

          this.boundaries.add(`${colIndex},${rowIndex}`);
        }
      });
    });
  }

  startingPosition(area) {
    const validPositions = [];
    
    // Define the tile range for the blue circle area (adjust these based on your map)
    const startX = 12; // Starting X tile (adjust based on the map)
    const endX = 15;   // Ending X tile
    const startY = 35; // Starting Y tile
    const endY = 25;   // Ending Y tile
  
    area.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        if (
          symbol !== 4098 && // Ensure it's not a boundary
          rowIndex >= startY && rowIndex <= endY &&
          colIndex >= startX && colIndex <= endX
        ) {
          validPositions.push({ x: colIndex, y: rowIndex });
        }
      });
    });
  
    if (validPositions.length === 0) {
      console.error("No valid starting positions found in the defined area!");
      return { x: startX, y: startY }; // Fallback position
    }
  
    // Randomly select a valid position
    const randomIndex = Math.floor(Math.random() * validPositions.length);
    return validPositions[randomIndex];
  }
  
  getClickedPosition(pointer) {
    const x = Math.floor(pointer.worldX / this.tileSize);
    const y = Math.floor(pointer.worldY / this.tileSize);
    return new Vec2(x, y);
  }

  update() {
    this.player.setVelocity(0, 0);

    if (this.cursors.left.isDown) {
      this.movePlayer(-1, 0);
      this.player.anims.play('walk-left', true);
    } else if (this.cursors.right.isDown) {
      this.movePlayer(1, 0);
      this.player.anims.play('walk-right', true);
    } else if (this.cursors.up.isDown) {
      this.movePlayer(0, -1);
      this.player.anims.play('walk-up', true);
    } else if (this.cursors.down.isDown) {
      this.movePlayer(0, 1);
      this.player.anims.play('walk-down', true);
    } else if (this.isMoving && this.path.length > 0) {
      const targetPoint = this.path[this.currentPathIndex];
      const targetX = targetPoint.x * this.tileSize + this.tileSize / 2;
      const targetY = targetPoint.y * this.tileSize + this.tileSize / 2;

      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY);

      if (distance < 5) {
        this.currentPathIndex++;
        if (this.currentPathIndex >= this.path.length) {
          this.isMoving = false;
          this.player.setVelocity(0, 0);
        }
      } else {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
        this.player.setVelocity(
          Math.cos(angle) * this.speed,
          Math.sin(angle) * this.speed
        );

        if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
          this.player.anims.play(Math.cos(angle) > 0 ? 'walk-right' : 'walk-left', true);
        } else {
          this.player.anims.play(Math.sin(angle) > 0 ? 'walk-down' : 'walk-up', true);
        }
      }
    } else {
      this.player.anims.stop();
    }
  }

  movePlayer(dx, dy) {
    this.player.setVelocity(dx * this.speed, dy * this.speed);
  }
}

export default MyGame;
