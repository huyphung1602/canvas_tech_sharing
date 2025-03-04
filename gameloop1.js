// Game constants
let CANVAS_WIDTH1 = 800;
let CANVAS_HEIGHT1 = 400;
const PLAYER_WIDTH1 = 50;
const PLAYER_HEIGHT1 = 50;
const PLAYER_SPEED1 = 300; // pixels per second
const MS_PER_FRAME1 = 1000 / 60; // 60 FPS
const NUM_STARS = 200; // Increased number of stars for larger screen

// Star object
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * CANVAS_WIDTH1;
        this.y = Math.random() * CANVAS_HEIGHT1;
        this.z = Math.random() * 3 + 1; // Star depth (affects speed and size)
        this.size = Math.max(1, 3 / this.z);
        this.speed = 50 / this.z; // Slower constant star movement for background effect
    }

    update(dt) {
        this.y += this.speed * dt;
        
        // Reset star when it goes off screen
        if (this.y > CANVAS_HEIGHT1) {
            this.reset();
            this.y = 0; // Start from top
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${1 / this.z})`; // Further stars are more transparent
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

// Game state
let gameRunning1 = false;
let lastTime1 = 0;
let player1 = {
    x: 0,
    y: 0,
    width: PLAYER_WIDTH1,
    height: PLAYER_HEIGHT1,
    speed: PLAYER_SPEED1,
    dx: 0,
    dy: 0
};

// Star field
let stars = Array.from({ length: NUM_STARS }, () => new Star());

// Input state
const keys1 = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

// Get canvas and container
const gameContainer1 = document.getElementById('game-container1');
const canvas1 = document.getElementById('gameCanvas1');
const ctx1 = canvas1.getContext('2d');

// Fullscreen handler
function toggleFullscreen1() {
    if (!document.fullscreenElement) {
        gameContainer1.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Resize handler
function resizeCanvas1() {
    if (document.fullscreenElement === gameContainer1) {
        // If in fullscreen, use screen dimensions
        CANVAS_WIDTH1 = window.innerWidth;
        CANVAS_HEIGHT1 = window.innerHeight;
    } else {
        // Otherwise use container dimensions
        const container = canvas1.parentElement;
        CANVAS_WIDTH1 = container.clientWidth;
        CANVAS_HEIGHT1 = container.clientHeight;
    }
    
    canvas1.width = CANVAS_WIDTH1;
    canvas1.height = CANVAS_HEIGHT1;
    
    // Reposition player when canvas is resized
    player1.x = CANVAS_WIDTH1 / 2 - player1.width / 2;
    player1.y = CANVAS_HEIGHT1 / 2 - player1.height / 2;
    
    // Reset stars for new canvas size
    stars = Array.from({ length: NUM_STARS }, () => new Star());
}

// Input handling
function processInput1() {
    // Reset velocities
    player1.dx = 0;
    player1.dy = 0;
    
    // Update velocities based on input
    if (keys1.ArrowLeft) player1.dx = -player1.speed;
    if (keys1.ArrowRight) player1.dx = player1.speed;
    if (keys1.ArrowUp) player1.dy = -player1.speed;    // Up is negative in canvas
    if (keys1.ArrowDown) player1.dy = player1.speed;   // Down is positive in canvas
}

// Update game state
function update1(deltaTime) {
    // Convert deltaTime to seconds
    const dt = deltaTime / 1000;
    
    // Update stars
    stars.forEach(star => star.update(dt));
    
    // Update player position
    player1.x += player1.dx * dt;
    player1.y += player1.dy * dt;
    
    // Keep player within bounds
    if (player1.x < 0) player1.x = 0;
    if (player1.x > CANVAS_WIDTH1 - player1.width) {
        player1.x = CANVAS_WIDTH1 - player1.width;
    }
    if (player1.y < 0) player1.y = 0;
    if (player1.y > CANVAS_HEIGHT1 - player1.height) {
        player1.y = CANVAS_HEIGHT1 - player1.height;
    }
}

// Render game state
function render1() {
    // Clear canvas
    ctx1.fillStyle = 'black';
    ctx1.fillRect(0, 0, CANVAS_WIDTH1, CANVAS_HEIGHT1);
    
    // Draw stars
    stars.forEach(star => star.draw(ctx1));
    
    // Draw player
    ctx1.fillStyle = '#4a9eff';
    ctx1.fillRect(player1.x, player1.y, player1.width, player1.height);
    
    // Add engine glow effects based on movement
    const glowIntensity = 0.4;
    
    // Bottom thruster (when moving down)
    if (player1.dy > 0) {
        const bottomGradient = ctx1.createRadialGradient(
            player1.x + player1.width / 2, player1.y + player1.height,
            0,
            player1.x + player1.width / 2, player1.y + player1.height,
            20
        );
        bottomGradient.addColorStop(0, `rgba(74, 158, 255, ${glowIntensity})`);
        bottomGradient.addColorStop(1, 'rgba(74, 158, 255, 0)');
        ctx1.fillStyle = bottomGradient;
        ctx1.fillRect(player1.x - 10, player1.y + player1.height, player1.width + 20, 20);
    }
    
    // Top thruster (when moving up)
    if (player1.dy < 0) {
        const topGradient = ctx1.createRadialGradient(
            player1.x + player1.width / 2, player1.y,
            0,
            player1.x + player1.width / 2, player1.y,
            20
        );
        topGradient.addColorStop(0, `rgba(74, 158, 255, ${glowIntensity})`);
        topGradient.addColorStop(1, 'rgba(74, 158, 255, 0)');
        ctx1.fillStyle = topGradient;
        ctx1.fillRect(player1.x - 10, player1.y - 20, player1.width + 20, 20);
    }
    
    // Right thruster (when moving left)
    if (player1.dx < 0) {
        const rightGradient = ctx1.createRadialGradient(
            player1.x + player1.width, player1.y + player1.height / 2,
            0,
            player1.x + player1.width, player1.y + player1.height / 2,
            20
        );
        rightGradient.addColorStop(0, `rgba(74, 158, 255, ${glowIntensity})`);
        rightGradient.addColorStop(1, 'rgba(74, 158, 255, 0)');
        ctx1.fillStyle = rightGradient;
        ctx1.fillRect(player1.x + player1.width, player1.y - 10, 20, player1.height + 20);
    }
    
    // Left thruster (when moving right)
    if (player1.dx > 0) {
        const leftGradient = ctx1.createRadialGradient(
            player1.x, player1.y + player1.height / 2,
            0,
            player1.x, player1.y + player1.height / 2,
            20
        );
        leftGradient.addColorStop(0, `rgba(74, 158, 255, ${glowIntensity})`);
        leftGradient.addColorStop(1, 'rgba(74, 158, 255, 0)');
        ctx1.fillStyle = leftGradient;
        ctx1.fillRect(player1.x - 20, player1.y - 10, 20, player1.height + 20);
    }
}

// Main game loop
function gameLoop1(timestamp) {
    if (!gameRunning1) return;

    const deltaTime = timestamp - lastTime1;
    
    if (deltaTime >= MS_PER_FRAME1) {
        processInput1();
        update1(deltaTime);
        render1();
        lastTime1 = timestamp;
    }
    
    requestAnimationFrame(gameLoop1);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (keys1.hasOwnProperty(e.code)) {
        keys1[e.code] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys1.hasOwnProperty(e.code)) {
        keys1[e.code] = false;
    }
});

// Resize listeners
window.addEventListener('resize', resizeCanvas1);
document.addEventListener('fullscreenchange', resizeCanvas1);

// Game controls
document.getElementById('startGame1').addEventListener('click', () => {
    if (!gameRunning1) {
        resizeCanvas1(); // Ensure canvas is properly sized
        gameRunning1 = true;
        lastTime1 = performance.now();
        requestAnimationFrame(gameLoop1);
    }
});

document.getElementById('stopGame1').addEventListener('click', () => {
    gameRunning1 = false;
});

document.getElementById('fullscreenGame1').addEventListener('click', toggleFullscreen1);