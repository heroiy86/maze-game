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
let touchStartX, touchStartY;
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (winMessage.classList.contains('hidden')) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
            if (dx > 30) movePlayer(1, 0); // Right
            else if (dx < -30) movePlayer(-1, 0); // Left
        } else { // Vertical swipe
            if (dy > 30) movePlayer(0, 1); // Down
            else if (dy < -30) movePlayer(0, -1); // Up
        }
    }
}, { passive: false });


newGameButton.addEventListener('click', init);
window.addEventListener('resize', init);

init();
