// Animation IDs for stopping animations
let animationIds = {};

// Helper function to stop all animations
function stopAllAnimations() {
    for (let id in animationIds) {
        if (animationIds[id]) {
            cancelAnimationFrame(animationIds[id]);
            animationIds[id] = null;
        }
    }
}

// Example 1: Canvas vs DOM Animation
function runExample1() {
    stopAllAnimations();
    // Canvas Animation
    const ctx = document.getElementById('canvas1').getContext('2d');
    let x = 0;

    function animate() {
        ctx.clearRect(0, 0, 150, 100);
        ctx.fillStyle = 'blue';
        ctx.fillRect(x, 40, 20, 20);
        x = (x + 2) % 130;
        animationIds['example1'] = requestAnimationFrame(animate);
    }
    animate();

    // DOM Animation
    const box = document.getElementById('box1');
    box.style.transition = 'none';
    box.style.left = '0px';
    setTimeout(() => {
        box.style.transition = 'left 2s linear infinite';
        box.style.left = '130px';
    }, 0);
}

function stopExample1() {
    if (animationIds['example1']) {
        cancelAnimationFrame(animationIds['example1']);
        animationIds['example1'] = null;
    }
    const box = document.getElementById('box1');
    box.style.transition = 'none';
    box.style.left = '0px';
}

// Basic Motion Animation
function runMotionExample() {
    stopAllAnimations();
    const canvas = document.getElementById('canvas-motion');
    const ctx = canvas.getContext('2d');
    let x = 0;
    const speed = 2;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#246';
        ctx.fillRect(x, canvas.height/2 - 20, 40, 40);
        x = (x + speed) % (canvas.width - 40);
        animationIds['motion'] = requestAnimationFrame(animate);
    }
    animate();
}

function stopMotionExample() {
    if (animationIds['motion']) {
        cancelAnimationFrame(animationIds['motion']);
        animationIds['motion'] = null;
    }
}

// Frame-based Animation Example
function runFrameBasedExample() {
    stopAllAnimations();
    const canvas = document.getElementById('frame-based-canvas');
    const ctx = canvas.getContext('2d');
    let x = 0;
    const speed = 3; // pixels per frame

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#246';
        ctx.fillRect(x, canvas.height/2 - 20, 40, 40);

        // Move by fixed amount each frame
        x = (x + speed) % (canvas.width - 40);

        animationIds['frame-based'] = requestAnimationFrame(animate);
    }
    animate();
}

function stopFrameBasedExample() {
    if (animationIds['frame-based']) {
        cancelAnimationFrame(animationIds['frame-based']);
        animationIds['frame-based'] = null;
    }
}

// Time-based Animation Example
function runTimeBasedExample() {
    stopAllAnimations();
    const canvas = document.getElementById('time-based-canvas');
    const ctx = canvas.getContext('2d');
    let x = 0;
    const speed = 150; // pixels per second
    let lastTime = null;

    function animate(currentTime) {
        if (!lastTime) {
            lastTime = currentTime;
            animationIds['time-based'] = requestAnimationFrame(animate);
            return;
        }

        // Calculate time elapsed since last frame in seconds
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw square
        ctx.fillStyle = '#246';
        ctx.fillRect(x, canvas.height/2 - 20, 40, 40);

        // Update position based on elapsed time
        x = (x + speed * deltaTime);

        // Reset position when reaching the end
        if (x >= canvas.width - 40) {
            x = 0;
        }

        // Add FPS display
        const fps = Math.round(1 / deltaTime);
        ctx.fillStyle = '#000';
        ctx.font = '12px monospace';
        ctx.fillText(`FPS: ${fps}`, 10, 20);

        animationIds['time-based'] = requestAnimationFrame(animate);
    }
    animate(performance.now());
}

function stopTimeBasedExample() {
    if (animationIds['time-based']) {
        cancelAnimationFrame(animationIds['time-based']);
        animationIds['time-based'] = null;
    }
}

// Performance Examples
function createParticles(count) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * 300,
        y: Math.random() * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: `hsl(${Math.random() * 360}, 50%, 50%)`
    }));
}

function runUnoptimizedExample() {
    stopAllAnimations();
    const canvas = document.getElementById('unoptimized');
    const ctx = canvas.getContext('2d');
    const particles = createParticles(1000);
    let lastTime = performance.now();
    let frames = 0;
    const fpsElement = document.getElementById('unoptimized-fps');

    function animate(currentTime) {
        // Calculate FPS
        const deltaTime = currentTime - lastTime;
        frames++;
        if (deltaTime >= 1000) {
            fpsElement.textContent = `FPS: ${Math.round(frames * 1000 / deltaTime)}`;
            frames = 0;
            lastTime = currentTime;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Unoptimized: Multiple state changes
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        animationIds['unoptimized'] = requestAnimationFrame(animate);
    }
    animate(performance.now());
}

function runOptimizedExample() {
    stopAllAnimations();
    const canvas = document.getElementById('optimized');
    const ctx = canvas.getContext('2d');
    const particles = createParticles(1000);
    let lastTime = performance.now();
    let frames = 0;
    const fpsElement = document.getElementById('optimized-fps');

    function animate(currentTime) {
        // Calculate FPS
        const deltaTime = currentTime - lastTime;
        frames++;
        if (deltaTime >= 1000) {
            fpsElement.textContent = `FPS: ${Math.round(frames * 1000 / deltaTime)}`;
            frames = 0;
            lastTime = currentTime;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Optimized: Group by color
        const byColor = particles.reduce((acc, particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            (acc[particle.color] = acc[particle.color] || []).push(particle);
            return acc;
        }, {});

        // Draw particles grouped by color
        Object.entries(byColor).forEach(([color, particles]) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            particles.forEach(particle => {
                ctx.moveTo(particle.x, particle.y);
                ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            });
            ctx.fill();
        });

        animationIds['optimized'] = requestAnimationFrame(animate);
    }
    animate(performance.now());
}

function stopUnoptimizedExample() {
    if (animationIds['unoptimized']) {
        cancelAnimationFrame(animationIds['unoptimized']);
        animationIds['unoptimized'] = null;
    }
}

function stopOptimizedExample() {
    if (animationIds['optimized']) {
        cancelAnimationFrame(animationIds['optimized']);
        animationIds['optimized'] = null;
    }
}

// Basic shapes example
function runBasicExample() {
    const canvas = document.getElementById('canvas-basic');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rectangle
    ctx.fillStyle = '#246';
    ctx.fillRect(50, 50, 60, 40);

    // Circle
    ctx.beginPath();
    ctx.arc(150, 70, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#48c';
    ctx.fill();

    // Triangle
    ctx.beginPath();
    ctx.moveTo(200, 90);
    ctx.lineTo(240, 40);
    ctx.lineTo(240, 90);
    ctx.closePath();
    ctx.fillStyle = '#6ae';
    ctx.fill();
}

function stopBasicExample() {
    const canvas = document.getElementById('canvas-basic');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Initialize Mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    flowchart: {
        curve: 'basis',
        useMaxWidth: true
    }
});

// Clear all canvases on page load
window.addEventListener('load', function() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});