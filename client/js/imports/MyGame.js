import findShortestPath from '../imports/controllers/pathFindings.js'; // Import pathfinding
import { Vec2 } from './controllers/linAlg.js';

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: 'MyGame' });
    this.boundaries = new Set(); // Set to hold non-walkable tiles
    this.tileSize = 20; // Tile size in pixels
    this.path = []; // To store the calculated path
    this.currentPathIndex = 0; // To track current position in the path
    this.isMoving = false;
    this.speed = 100; // Movement speed of the player
  }

  preload() {
    this.load.image("background", "assets/starting area.png");
    this.load.spritesheet('player', 'assets/Player.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('obstacle', 'assets/Obstacle.png');
  }

  create() {
    const baseScale = 1;
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
    this.player.setDisplaySize(this.tileSize, this.tileSize);
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
          // Calculate the correct position for the obstacle based on the collision size
          const boundaryX = colIndex * this.tileSize + this.tileSize / 2; // Center the obstacle on the tile
          const boundaryY = rowIndex * this.tileSize + this.tileSize / 2;
  
          // Create a smaller obstacle
          const smallObstacleSize = this.tileSize * 0.5; // Set the size to half of the tile size
          const obstacle = this.add.image(boundaryX, boundaryY, 'obstacle');
  
          // Set the display size to be smaller than the tile
          obstacle.setDisplaySize(smallObstacleSize, smallObstacleSize); // Smaller obstacle
  
          // Ensure the obstacle is aligned with the grid (optional for precision)
          obstacle.setOrigin(-0, -0); // Align the center of the obstacle with the tile grid
  
          // Hide the obstacle image
          obstacle.setVisible(false); // This hides the obstacle image but keeps it in the game
  
          // Add the position of the obstacle to the boundaries for pathfinding
          this.boundaries.add(`${colIndex},${rowIndex}`);
  
          console.log(`Obstacle created at: row ${rowIndex}, col ${colIndex}`);
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
    } else if (this.cursors.right.isDown) {
      this.movePlayer(1, 0);
    } else if (this.cursors.up.isDown) {
      this.movePlayer(0, -1);
    } else if (this.cursors.down.isDown) {
      this.movePlayer(0, 1);
    }

    if (this.isMoving && this.path.length > 0) {
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
      }
    }
  }

  movePlayer(dx, dy) {
    const newX = this.player.x + dx * this.speed;
    const newY = this.player.y + dy * this.speed;

    this.player.setVelocity(dx * this.speed, dy * this.speed);
  }
}

export default MyGame;
