const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const pvpBtn = document.getElementById("pvp");
const pvcBtn = document.getElementById("pvc");

let currentPlayer = "X";
let gameMode = null;
let boardState = Array(9).fill("");
let isGameOver = false;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // cols
  [0, 4, 8], [2, 4, 6]              // diagonals
];

function createBoard() {
  board.innerHTML = "";
  boardState = Array(9).fill("");
  isGameOver = false;
  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (boardState[index] !== "" || isGameOver) return;

  makeMove(index, currentPlayer);

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
    isGameOver = true;
    return;
  }

  if (!boardState.includes("")) {
    statusText.textContent = "It's a Draw!";
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "PVC" && currentPlayer === "O" && !isGameOver) {
    setTimeout(computerMove, 500);
  } else {
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function makeMove(index, player) {
  boardState[index] = player;
  const cell = board.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
}

function checkWinner(player) {
  return winPatterns.some(pattern =>
    pattern.every(index => boardState[index] === player)
  );
}

function computerMove() {
  const emptyIndices = boardState
    .map((val, idx) => val === "" ? idx : null)
    .filter(val => val !== null);

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, "O");

  if (checkWinner("O")) {
    statusText.textContent = "Computer Wins! 🤖";
    isGameOver = true;
    return;
  }

  if (!boardState.includes("")) {
    statusText.textContent = "It's a Draw!";
    isGameOver = true;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

restartBtn.addEventListener("click", createBoard);
pvpBtn.addEventListener("click", () => {
  gameMode = "PVP";
  createBoard();
});
pvcBtn.addEventListener("click", () => {
  gameMode = "PVC";
  createBoard();
});

// Initial state
statusText.textContent = "Choose a game mode";
