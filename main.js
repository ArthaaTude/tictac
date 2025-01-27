const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");

let currentPlayer = "X"; // Player always starts
let gameActive = true;
let boardState = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const winningCombinations = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [2, 0],
    [1, 1],
    [0, 2],
  ],
];

function checkWinner() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (
      boardState[a[0]][a[1]] &&
      boardState[a[0]][a[1]] === boardState[b[0]][b[1]] &&
      boardState[a[0]][a[1]] === boardState[c[0]][c[1]]
    ) {
      gameActive = false;
      setTimeout(() => alert(`${boardState[a[0]][a[1]]} MENANG! 🏆`), 10);
      return;
    }
  }

  if (!boardState.flat().includes(null)) {
    gameActive = false;
    setTimeout(() => alert("Seri! 😞"), 10);
  }
}

function minimax(boardState, depth, isMaximizing) {
  const scores = { X: -1, O: 1, tie: 0 };
  const winner = checkGameStatus(boardState);
  if (winner !== null) {
    return scores[winner];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardState[i][j] === null) {
          boardState[i][j] = "O"; // Bot's move
          const score = minimax(boardState, depth + 1, false);
          boardState[i][j] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardState[i][j] === null) {
          boardState[i][j] = "X"; // Player's move
          const score = minimax(boardState, depth + 1, true);
          boardState[i][j] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function checkGameStatus(boardState) {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (
      boardState[a[0]][a[1]] &&
      boardState[a[0]][a[1]] === boardState[b[0]][b[1]] &&
      boardState[a[0]][a[1]] === boardState[c[0]][c[1]]
    ) {
      return boardState[a[0]][a[1]];
    }
  }
  return boardState.flat().includes(null) ? null : "tie";
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (boardState[i][j] === null) {
        boardState[i][j] = "O"; // Bot's move
        const score = minimax(boardState, 0, false);
        boardState[i][j] = null;
        if (score > bestScore) {
          bestScore = score;
          move = [i, j];
        }
      }
    }
  }
  return move;
}

function handleCellClick(e) {
  const cell = e.target;
  const cellIndex = cell.getAttribute("data-cell");
  const row = Math.floor(cellIndex / 3);
  const col = cellIndex % 3;

  if (boardState[row][col] || !gameActive || currentPlayer === "O") return;

  boardState[row][col] = currentPlayer;
  cell.textContent = currentPlayer;
  checkWinner();

  currentPlayer = "O"; // Switch to bot

  setTimeout(() => {
    if (gameActive) {
      botMove();
    }
  }, 500);
}

function botMove() {
  const move = bestMove();
  const [row, col] = move;
  boardState[row][col] = "O";
  cells[row * 3 + col].textContent = "O";
  checkWinner();

  currentPlayer = "X"; // Switch back to player
}

function restartGame() {
  boardState = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  gameActive = true;
  currentPlayer = "X";
  cells.forEach((cell) => (cell.textContent = ""));
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
