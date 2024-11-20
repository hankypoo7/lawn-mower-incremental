let mowerPosition = { x: 0, y: 0 }; // Starting position of the mower
let grassCounter = 0; // Initial grass counter
let gridSize = 10; // Grid size (10x10)
let growInterval; // Variable to store interval for grass regrowth
let upgradeCosts = {
    speed: 50,  // Cost for faster grow speed
    value: 100, // Cost for more valuable grass
    grid: 150,  // Cost for bigger grid
    size: 200   // Cost for bigger mower
};
let regrowSpeed = 5000; // Regrowth time in ms (start with 1000ms)
let grassValue = 1; // Initial value for each mowed grass
const gridContainerSize = 500; // Fixed size for the game container
let mowerSizeMultiplier = 1; // Default mower size multiplier

// Function to create the grid
function createGrid() {
    let grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear the grid
    let cellSize = gridContainerSize / gridSize; // Calculate size of each grid cell
    grid.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            let cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.setAttribute('data-x', x);
            cell.setAttribute('data-y', y);
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            grid.appendChild(cell);
        }
    }

    // Adjust mower size
    const mower = document.getElementById('mower');
    mower.style.width = `${cellSize * mowerSizeMultiplier}px`;
    mower.style.height = `${cellSize * mowerSizeMultiplier}px`;
}

// Function to reset the grass color to dark green after 2 seconds
function regrowGrass() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        if (cell.style.backgroundColor === 'lightgreen') {
            setTimeout(() => {
                cell.style.backgroundColor = '#3e7e42'; // Dark green (unmowed grass)
            }, regrowSpeed); // Delay before transitioning back to dark green
        }
    });
}

// Function to handle mower movement and mowing
function moveMower(direction) {
    const mower = document.getElementById('mower');
    const grid = document.getElementById('grid');

    // Move the mower based on the direction, ensuring it stays within bounds
    if (direction === 'up' && mowerPosition.y > 0) mowerPosition.y--;
    if (direction === 'down' && mowerPosition.y + mowerSizeMultiplier < gridSize) mowerPosition.y++;
    if (direction === 'left' && mowerPosition.x > 0) mowerPosition.x--;
    if (direction === 'right' && mowerPosition.x + mowerSizeMultiplier < gridSize) mowerPosition.x++;

    // Adjust affected cells based on mower size
    for (let offsetY = 0; offsetY < mowerSizeMultiplier; offsetY++) {
        for (let offsetX = 0; offsetX < mowerSizeMultiplier; offsetX++) {
            const cell = grid.querySelector(`[data-x="${mowerPosition.x + offsetX}"][data-y="${mowerPosition.y + offsetY}"]`);
            if (cell && cell.style.backgroundColor !== 'lightgreen') {
                cell.style.backgroundColor = 'lightgreen'; // Mowed grass
                grassCounter += grassValue; // Increment the grass counter
                document.getElementById('grassCounter').textContent = `Grass Mowed: ${grassCounter}`;
            }
        }
    }

    // Update the mower's position on the screen
    const cellSize = gridContainerSize / gridSize;
    mower.style.top = `${mowerPosition.y * (gridContainerSize / gridSize)}px`;
    mower.style.left = `${mowerPosition.x * (gridContainerSize / gridSize)}px`;

    regrowGrass(); // Start the regrowth process
}

// Event listeners for arrow key movements
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') moveMower('up');
    if (event.key === 'ArrowDown') moveMower('down');
    if (event.key === 'ArrowLeft') moveMower('left');
    if (event.key === 'ArrowRight') moveMower('right');
});

// Upgrade 1: Faster grow speed
document.getElementById('upgrade1').addEventListener('click', () => {
    if (grassCounter >= upgradeCosts.speed) {
        grassCounter -= upgradeCosts.speed;
        regrowSpeed = Math.max(500, regrowSpeed - 200); // Speed up regrow (but don't go below 500ms)
        document.getElementById('grassCounter').textContent = `Grass Mowed: ${grassCounter}`;
        upgradeCosts.speed = Math.floor(upgradeCosts.speed * 1.5); // Increase the upgrade cost
        document.getElementById('upgrade1').textContent = `Faster Growing Grass (${upgradeCosts.speed} Grass)`;
    }
});

// Upgrade 2: More Valuable Grass
document.getElementById('upgrade2').addEventListener('click', () => {
    if (grassCounter >= upgradeCosts.value) {
        grassCounter -= upgradeCosts.value; // Deduct the upgrade cost
        grassValue++; // Increase the value of mowed grass
        upgradeCosts.value = Math.floor(upgradeCosts.value * 1.5); // Increase the upgrade cost
        document.getElementById('grassCounter').textContent = `Grass Mowed: ${grassCounter}`;
        document.getElementById('upgrade2').textContent = `More Valuable Grass (${upgradeCosts.value} Grass)`;
    }
});

// Upgrade 3: Bigger grid size
document.getElementById('upgrade3').addEventListener('click', () => {
    if (grassCounter >= upgradeCosts.grid) {
        grassCounter -= upgradeCosts.grid; // Deduct the upgrade cost
        gridSize += 5; // Increase the grid size by 5x5
        upgradeCosts.grid = Math.floor(upgradeCosts.grid * 1.5); // Increase the upgrade cost
        document.getElementById('grassCounter').textContent = `Grass Mowed: ${grassCounter}`;
        document.getElementById('upgrade3').textContent = `Bigger Grid (${upgradeCosts.grid} Grass)`;
        createGrid(); // Recreate the grid with the new size
    }
});

// Upgrade 4: Bigger Mower
document.getElementById('upgrade4').addEventListener('click', () => {
    if (grassCounter >= upgradeCosts.size) {
        grassCounter -= upgradeCosts.size; // Deduct the upgrade cost
        mowerSizeMultiplier++; // Increase the mower size multiplier
        upgradeCosts.size = Math.floor(upgradeCosts.size * 1.5); // Increase the upgrade cost
        document.getElementById('grassCounter').textContent = `Grass Mowed: ${grassCounter}`;
        document.getElementById('upgrade4').textContent = `Bigger Mower (${upgradeCosts.size} Grass)`;
        createGrid(); // Recreate the grid to adjust the mower size
    }
});

// Create the grid when the page loads
createGrid();

// Regrow grass at the specified interval
setInterval(regrowGrass, regrowSpeed);
