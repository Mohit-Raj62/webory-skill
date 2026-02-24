// Set up game constants
const GRID_SIZE = 4;
const NUM_MINES = 4;

// Set up game state
let grid = [];
let minesLeft = NUM_MINES;
let timeElapsed = 0;
let gameOver = false;

// Create the grid
for (let i = 0; i < GRID_SIZE; i++) {
  grid[i] = [];
  for (let j = 0; j < GRID_SIZE; j++) {
    grid[i][j] = {
      mine: false,
      revealed: false,
      adjacentMines: 0,
    };
  }
}

// Randomly place mines
for (let i = 0; i < NUM_MINES; i++) {
  let x = Math.floor(Math.random() * GRID_SIZE);
  let y = Math.floor(Math.random() * GRID_SIZE);
  grid[x][y].mine = true;
}

// Function to reveal a cell
function revealCell(x, y) {
  if (grid[x][y].revealed || gameOver) return;
  grid[x][y].revealed = true;
  if (grid[x][y].mine) {
    // Game over!
    gameOver = true;
    alert("Game Over!");
  } else {
    // Reveal adjacent cells
    let adjacentMines = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          x + i >= 0 &&
          x + i < GRID_SIZE &&
          y + j >= 0 &&
          y + j < GRID_SIZE
        ) {
          if (grid[x + i][y + j].mine) adjacentMines++;
        }
      }
    }
    grid[x][y].adjacentMines = adjacentMines;
    if (adjacentMines === 0) {
      // Recursively reveal adjacent cells
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            x + i >= 0 &&
            x + i < GRID_SIZE &&
            y + j >= 0 &&
            y + j < GRID_SIZE
          ) {
            revealCell(x + i, y + j);
          }
        }
      }
    }
  }
}

// Function to handle cell click
function handleCellClick(event) {
  let x = event.target.dataset.x;
  let y = event.target.dataset.y;
  revealCell(x, y);
}

// Create grid elements
for (let i = 0; i < GRID_SIZE; i++) {
  for (let j = 0; j < GRID_SIZE; j++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.x = i;
    cell.dataset.y = j;
    cell.addEventListener("click", handleCellClick);
    document.querySelector(".grid").appendChild(cell);
  }
}

// Update game info
function updateGameInfo() {
  document.querySelector(
    "#mines-left"
  ).textContent = `Mines left: ${minesLeft}`;
  document.querySelector(
    "#time-elapsed"
  ).textContent = `Time elapsed: ${timeElapsed} seconds`;
}
