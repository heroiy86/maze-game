const canvas = document.getElementById('maze-canvas');
const ctx = canvas.getContext('2d');
const winMessage = document.getElementById('win-message');
const newGameButton = document.getElementById('new-game-button');
const gameContainer = document.getElementById('game-container');

let maze, player, goal, cellSize, mazeSize;

function init() {
    const containerSize = Math.min(gameContainer.clientWidth, gameContainer.clientHeight);
    canvas.width = containerSize;
    canvas.height = containerSize;
    
    mazeSize = 10; // 10x10 grid
    cellSize = canvas.width / mazeSize;

    player = { x: 0, y: 0 };
    goal = { x: mazeSize - 1, y: mazeSize - 1 };

    maze = generateMaze(mazeSize, mazeSize);
    draw();
    winMessage.classList.add('hidden');
}

function generateMaze(width, height) {
    const maze = Array.from({ length: height }, () => Array.from({ length: width }, () => ({
        n: true, s: true, e: true, w: true, visited: false
    })));

    const stack = [];
    let current = { x: 0, y: 0 };
    maze[current.y][current.x].visited = true;

    do {
        const neighbors = [];
        const { x, y } = current;

        if (y > 0 && !maze[y - 1][x].visited) neighbors.push({ x, y: y - 1, dir: 'n', opposite: 's' });
        if (y < height - 1 && !maze[y + 1][x].visited) neighbors.push({ x, y: y + 1, dir: 's', opposite: 'n' });
        if (x < width - 1 && !maze[y][x + 1].visited) neighbors.push({ x: x + 1, y, dir: 'e', opposite: 'w' });
        if (x > 0 && !maze[y][x - 1].visited) neighbors.push({ x: x - 1, y, dir: 'w', opposite: 'e' });

        if (neighbors.length > 0) {
            stack.push(current);
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            
            maze[current.y][current.x][next.dir] = false;
            maze[next.y][next.x][next.opposite] = false;
            
            current = { x: next.x, y: next.y };
            maze[current.y][current.x].visited = true;
        } else if (stack.length > 0) {
            current = stack.pop();
        }
    } while (stack.length > 0);

    return maze;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze walls
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            const cell = maze[y][x];
            if (cell.n) {
                ctx.beginPath();
                ctx.moveTo(x * cellSize, y * cellSize);
                ctx.lineTo((x + 1) * cellSize, y * cellSize);
                ctx.stroke();
            }
            if (cell.s) {
                ctx.beginPath();
                ctx.moveTo(x * cellSize, (y + 1) * cellSize);
                ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                ctx.stroke();
            }
            if (cell.e) {
                ctx.beginPath();
                ctx.moveTo((x + 1) * cellSize, y * cellSize);
                ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                ctx.stroke();
            }
            if (cell.w) {
                ctx.beginPath();
                ctx.moveTo(x * cellSize, y * cellSize);
                ctx.lineTo(x * cellSize, (y + 1) * cellSize);
                ctx.stroke();
            }
        }
    }

    // Draw goal
    ctx.fillStyle = 'gold';
    ctx.font = `${cellSize * 0.6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', goal.x * cellSize + cellSize / 2, goal.y * cellSize + cellSize / 2);


    // Draw player
    ctx.fillStyle = 'tomato';
    ctx.font = `${cellSize * 0.6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('😀', player.x * cellSize + cellSize / 2, player.y * cellSize + cellSize / 2);
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (newX < 0 || newX >= mazeSize || newY < 0 || newY >= mazeSize) {
        return;
    }

    if (dx === 1 && !maze[player.y][player.x].e) player.x = newX;
    if (dx === -1 && !maze[player.y][player.x].w) player.x = newX;
    if (dy === 1 && !maze[player.y][player.x].s) player.y = newY;
    if (dy === -1 && !maze[player.y][player.x].n) player.y = newY;

    draw();

    if (player.x === goal.x && player.y === goal.y) {
        winMessage.classList.remove('hidden');
    }
}

// Keyboard controls
window.addEventListener('keydown', (e) => {
    if (winMessage.classList.contains('hidden')) {
        switch (e.key) {
            case 'ArrowUp': movePlayer(0, -1); break;
            case 'ArrowDown': movePlayer(0, 1); break;
            case 'ArrowLeft': movePlayer(-1, 0); break;
            case 'ArrowRight': movePlayer(1, 0); break;
        }
    }
});

// Touch controls
let lastTouchX, lastTouchY;
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (winMessage.classList.contains('hidden')) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        const dx = touchX - lastTouchX;
        const dy = touchY - lastTouchY;

        // Determine movement direction based on the larger absolute difference
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > cellSize / 2) { // Move right if dragged more than half a cell
                movePlayer(1, 0);
                lastTouchX = touchX; // Reset last touch to prevent multiple moves for one drag
            } else if (dx < -cellSize / 2) { // Move left
                movePlayer(-1, 0);
                lastTouchX = touchX;
            }
        } else {
            if (dy > cellSize / 2) { // Move down
                movePlayer(0, 1);
                lastTouchY = touchY;
            } else if (dy < -cellSize / 2) { // Move up
                movePlayer(0, -1);
                lastTouchY = touchY;
            }
        }
    }
}, { passive: false });


newGameButton.addEventListener('click', init);

// Control button event listeners
document.getElementById('up-button').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('down-button').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('left-button').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('right-button').addEventListener('click', () => movePlayer(1, 0));

window.addEventListener('resize', init);

init();
