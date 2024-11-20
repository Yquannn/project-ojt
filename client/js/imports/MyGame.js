import findShortestPath from '../imports/controllers/pathFindings.js'; // Import pathfinding
import { Vec2 } from './controllers/linAlg.js';
import { createPlayerAnimations } from './animaation/playerAnimation.js'; // Import the animation module

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: 'MyGame' });
    this.boundaries = new Set(); // Set to hold non-walkable tiles
    this.tileSize = 20; // Tile size in pixels (you can keep this the same)
    this.path = []; // To store the calculated path
    this.currentPathIndex = 0; // To track current position in the path
    this.isMoving = false;
    this.speed = 50; 
    this.chopping = false; // To prevent chopping while already chopping
    this.chopTimer = null; // To manage the timer
    this.timerText = null; // To display the timer
    this.isAutomated = false
  }

  preload() {
    this.load.image("background", "assets/starting area.png");
    this.load.spritesheet('player', 'assets/Player.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('obstacle', 'assets/Obstacle.png');
  }

  create() {
    const baseScale = 1.5;
    const tilePixelSize = this.tileSize; // Match the tile size
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Background setup
    this.background = this.add.image(gameWidth / 2, gameHeight / 2, "background");
    this.background.setOrigin(0.5, 0.5);
    this.background.setScale(
      gameWidth / this.background.width,
      gameHeight / this.background.height
    );
    createPlayerAnimations(this); // Initialize animations

    // Collision map setup
    const rowLength = 100; // Length of a row in the collision data
    const collisionMap = [];
    for (let i = 0; i < collision.length; i += rowLength) {
      collisionMap.push(collision.slice(i, i + rowLength));
    }

    // Create obstacles
    this.boundaries = new Set(); // Initialize boundaries as a Set
    this.createObstacles(collisionMap);

    // Player setup at the center
    const centerX = (rowLength * tilePixelSize) / 2;
    const centerY = (collisionMap.length * tilePixelSize) / 2;
    this.player = this.physics.add.sprite(centerX, centerY, "player");

    // Set the collision box size to match tile size (optional)
    this.player.setSize(this.tileSize, this.tileSize);
    this.player.setOffset(10, 0); // Optional: adjust the offset for better alignment

    // Make the player sprite larger by scaling the sprite
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

  createObstacles(collisionMap) {
    collisionMap.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        if (symbol === 4098) { // Boundary symbol (adjust based on your map)
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

        // Determine animation based on direction
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
