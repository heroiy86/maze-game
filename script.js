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
            case 'ArrowUp':
                e.preventDefault();
                movePlayer(0, -1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                movePlayer(0, 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                movePlayer(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                movePlayer(1, 0);
                break;
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


newGameButton.addEventListener('click', init);

// Control button event listeners
document.getElementById('up-button').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('down-button').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('left-button').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('right-button').addEventListener('click', () => movePlayer(1, 0));

window.addEventListener('resize', init);

document.addEventListener('DOMContentLoaded', init);
