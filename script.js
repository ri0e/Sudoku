console.log("hi get out of the console ( > w <* )");

// Vars
let currentDifficulty = "easy";
let solution = [];
let currentSudoku = [];

// Show a message to the user
function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = type;
}

// Set the difficulty level
function setDifficulty(difficulty) {
  currentDifficulty = difficulty;

  // Update buttons
  document.querySelectorAll(".difficulty-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document
    .querySelector(`.difficulty-btn.${difficulty}`)
    .classList.add("active");

  // Generate new puzzle
  generateNewSudoku();
}

// Generate a new Sudoku puzzle based on the current difficulty
function generateNewSudoku() {
  const result = sudokuLevel(currentDifficulty);
  currentSudoku = result.sudokuCopy;
  solution = result.solution;
  renderSudoku(currentSudoku);
  showMessage(
    `New ${currentDifficulty} Sudoku puzzle generated with ${result.clues} clues!`,
    "success"
  );
}

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

// Solving the Sudoku with backtracking and counting the solutions
function solveSudoku(grid, countSolutions = false) {
  let solutions = 0;
  function solve() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          let nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of nums) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;

              if (countSolutions) {
                solve();
              } else {
                if (solve()) return true;
              }

              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    if (countSolutions) {
      solutions++;
      return false;
    }
    return true;
  }
  if (countSolutions) {
    solve();
    return solutions;
  } else {
    return solve();
  }
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

// Count solutions for uniqueness
function countSolutions(grid) {
  // Deep copy
  const gridCopy = JSON.parse(JSON.stringify(grid));
  return solveSudoku(gridCopy, true);
}

// Generate Sudoku based on difficulty
function sudokuLevel(difficulty) {
  // Difficulty levels
  const difficultyLevels = {
    easy: { minClues: 36, maxClues: 40 },
    medium: { minClues: 30, maxClues: 35 },
    hard: { minClues: 25, maxClues: 29 },
    expert: { minClues: 22, maxClues: 24 },
  };

  const { minClues, maxClues } = difficultyLevels[difficulty];
  const cluesToKeep =
    Math.floor(Math.random() * (minClues - maxClues + 1)) + minClues;

  let validSudoku = false;
  let grid, sudokuCopy, solutionCopy;
  let attempts = 0;

  // Keep trying until a valid Sudoku is created (with a unique solution)
  while (!validSudoku && attempts < 5) {
    attempts++;

    // Generate a complete Sudoku
    grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillDiagonalBoxes(grid);
    solveSudoku(grid);

    solutionCopy = JSON.parse(JSON.stringify(grid));
    sudokuCopy = JSON.parse(JSON.stringify(grid));

    // Remove nums while ensuring uniqueness
    let count = 81 - cluesToKeep;
    let removalAttempts = 0;
    const maxRemovalAttempts = 50;

    while (count > 0 && removalAttempts < maxRemovalAttempts) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);

      if (sudokuCopy[row][col] !== 0) {
        let backup = sudokuCopy[row][col];
        sudokuCopy[row][col] = 0;

        // Check if the Sudoku still has one solution
        let tempGrid = JSON.parse(JSON.stringify(sudokuCopy));
        const numSulotions = countSolutions(tempGrid);

        if (numSulotions === 1) {
          count--;
        } else {
          sudokuCopy[row][col] = backup;
        }
      }
      removalAttempts++;
    }
    // Final validation
    const tempGrid = JSON.parse(JSON.stringify(sudokuCopy));

    if (countSolutions(tempGrid) === 1) {
      validSudoku = true;
    }
  }
  if (!validSudoku) {
    // Fallback: return a simpler puzzle if we couldn't generate a valid one
    return sudokuLevel("easy");
  }
  return {
    sudokuCopy,
    solution: solutionCopy,
    difficulty,
    clues: cluesToKeep,
  };
}

// Rendering The Sudoku
function renderSudoku(grid) {
  let container = document.getElementById("board");
  let table = document.createElement("table");

  for (let i = 0; i < 9; i++) {
    let row = document.createElement("tr");

    for (let j = 0; j < 9; j++) {
      let cell = document.createElement("td");

      if (grid[i][j] !== 0) {
        cell.textContent = grid[i][j]; // clue
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;

        // only allow numbers 1–9
        input.addEventListener("input", () => {
          input.value = input.value.replace(/[^1-9]/g, "");
        });
        cell.appendChild(input);
      }
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  // Clean the board if already filled
  container.innerHTML = "";
  container.appendChild(table);
}

// Generate and render
window.onload = function () {
  generateNewSudoku();
};
