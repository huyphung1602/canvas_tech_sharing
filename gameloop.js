// Game constants
let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLAYER_SPEED = 300; // pixels per second
const MS_PER_FRAME = 1000 / 60; // 60 FPS

// Game state
let gameRunning = false;
let lastTime = 0;
let player = {
    x: 0,
    y: 0,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: PLAYER_SPEED,
    direction: 0 // -1 for left, 0 for none, 1 for right
};

// Input state
const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

// Get canvas and container
const gameContainer = document.getElementById('game-container');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fullscreen handler
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Resize handler
function resizeCanvas() {
    if (document.fullscreenElement === gameContainer) {
        // If in fullscreen, use screen dimensions
        CANVAS_WIDTH = window.innerWidth;
        CANVAS_HEIGHT = window.innerHeight;
    } else {
        // Otherwise use container dimensions
        const container = canvas.parentElement;
        CANVAS_WIDTH = container.clientWidth;
        CANVAS_HEIGHT = container.clientHeight;
    }
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Center the player both horizontally and vertically
    player.x = CANVAS_WIDTH / 2 - player.width / 2;
    player.y = CANVAS_HEIGHT / 2 - player.height / 2;
}

// Input handling
function processInput() {
    player.direction = 0;
    if (keys.ArrowLeft) player.direction = -1;
    if (keys.ArrowRight) player.direction = 1;
}

// Update game state
function update(deltaTime) {
    // Convert deltaTime to seconds
    const dt = deltaTime / 1000;

    // Update player position
    player.x += player.direction * player.speed * dt;

    // Keep player within bounds
    if (player.x < 0) player.x = 0;
    if (player.x > CANVAS_WIDTH - player.width) {
        player.x = CANVAS_WIDTH - player.width;
    }
}

// Render game state
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw player
    ctx.fillStyle = '#246';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Main game loop
function gameLoop(timestamp) {
    if (!gameRunning) return;

    const deltaTime = timestamp - lastTime;

    if (deltaTime >= MS_PER_FRAME) {
        processInput();
        update(deltaTime);
        render();
        lastTime = timestamp;
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

// Resize listeners
window.addEventListener('resize', resizeCanvas);
document.addEventListener('fullscreenchange', resizeCanvas);

// Game controls
document.getElementById('startGame').addEventListener('click', () => {
    if (!gameRunning) {
        resizeCanvas(); // Ensure canvas is properly sized
        gameRunning = true;
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
});

document.getElementById('stopGame').addEventListener('click', () => {
    gameRunning = false;
});

document.getElementById('fullscreenGame').addEventListener('click', toggleFullscreen);