console.log("hi get out of console >w<*");

// Number of numbers on the board
let clues = 30;

// Checks if placing a number is valid
function isSafe(grid, row, col, num) {
  //Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check box 3x3
  let startRow = row - (row % 3);
  let startCol = col - (col % 3);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  return true;
}

// Randomly shuffles an array using Fisher–Yates algorithm
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Solving the Sudoku with backtracking
function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        let nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of nums) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Fill diagonal boxes first (they are independent)
function fillDiagonalBoxes(grid) {
  for (let i = 0; i < 9; i += 3) {
    fillBox(grid, i, i);
  }
}

// Filling the boxes 3x3
function fillBox(grid, startRow, startCol) {
  let nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[startRow + i][startCol + j] = nums[index++];
    }
  }
}

// Remove numbers to create the puzzle
function removeNumbers(grid, cluesToKeep) {
  let count = 81 - cluesToKeep;
  let attempts = 0;
  const maxAttempts = 200;

  while (count > 0 && attempts < maxAttempts) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);

    if (grid[row][col] !== 0) {
      let backup = grid[row][col];
      grid[row][col] = 0;

      // Copy the grid to check if puzzle still solvable
      let tempGrid = JSON.parse(JSON.stringify(grid));

      if (solveSudoku(tempGrid)) {
        count--;
      } else {
        grid[row][col] = backup;
      }
    }
    attempts++;
  }
}

function generateSudoku() {
  let grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  // Fill diagonal boxes first
  fillDiagonalBoxes(grid);

  // Solve the complete puzzle
  solveSudoku(grid);

  // Remove numbers to create the puzzle
  removeNumbers(grid, clues);

  return grid;
}

// Rendering The Sudoku
function renderSudoku(grid) {
  let container = document.getElementById("board");
  let table = document.createElement("table");
  table.id = "table";

  for (let i = 0; i < 9; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      let cell = document.createElement("td");
      cell.textContent = grid[i][j] !== 0 ? grid[i][j] : "";
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  // Clean the board if already filled
  container.innerHTML = "";
  container.appendChild(table);
}

// Generate and render
let sudoku = generateSudoku();
renderSudoku(sudoku);
