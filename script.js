const boardElement = document.getElementById("board");
const timerDisplay = document.getElementById("timer");
const endMessage = document.getElementById("endMessage");

let board = [];
let selected = null;
let timerStarted = false;
let timerInterval;
let seconds = 0;

// Default peg: ● | Hole: ◯
const PEG = "●";
const HOLE = "◯";

// 7x7 Brainvita board layout
const layout = [
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0]
];

function initBoard() {
  board = layout.map((row, r) => row.map((cell, c) => {
    if (cell === 0) return null;
    if (r === 3 && c === 3) return HOLE;
    return PEG;
  }));
}

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      const div = document.createElement("div");
      div.className = "cell";
      const inner = document.createElement("div");
      inner.className = "cell-content";
      if (cell === null) {
        inner.classList.add("invalid");
      } else {
        inner.textContent = cell;
        if (selected && selected.r === r && selected.c === c) {
          inner.classList.add("selected");
        }
        inner.onclick = () => handleClick(r, c);
      }
      div.appendChild(inner);
      boardElement.appendChild(div);
    });
  });
}

function handleClick(r, c) {
  if (!timerStarted && board[r][c] === PEG) startTimer();

  if (selected) {
    if (isValidMove(selected.r, selected.c, r, c)) {
      makeMove(selected.r, selected.c, r, c);
      selected = null;
      renderBoard();
      checkEnd();
      return;
    } else {
      selected = null;
      renderBoard();
    }
  }

  if (board[r][c] === PEG) {
    selected = { r, c };
    renderBoard();
  }
}

function isValidMove(r1, c1, r2, c2) {
  if (board[r2][c2] !== HOLE) return false;
  const dr = r2 - r1, dc = c2 - c1;
  if (Math.abs(dr) === 2 && dc === 0) {
    return board[r1 + dr / 2][c1] === PEG;
  }
  if (Math.abs(dc) === 2 && dr === 0) {
    return board[r1][c1 + dc / 2] === PEG;
  }
  return false;
}

function makeMove(r1, c1, r2, c2) {
  const mr = (r1 + r2) / 2;
  const mc = (c1 + c2) / 2;
  board[r1][c1] = HOLE;
  board[mr][mc] = HOLE;
  board[r2][c2] = PEG;
}

function hasValidMoves() {
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c] === PEG) {
        const moves = [
          [r + 2, c], [r - 2, c], [r, c + 2], [r, c - 2]
        ];
        for (const [nr, nc] of moves) {
          if (nr >= 0 && nr < 7 && nc >= 0 && nc < 7) {
            if (isValidMove(r, c, nr, nc)) return true;
          }
        }
      }
    }
  }
  return false;
}

function checkEnd() {
  if (!hasValidMoves()) {
    stopTimer();
    const pegsLeft = board.flat().filter(cell => cell === PEG).length;
    if (pegsLeft === 1) {
      endMessage.textContent = "Congratulations! Only one peg left!";
    } else {
      endMessage.textContent = `Game Over. Pegs remaining: ${pegsLeft}`;
    }
  }
}

function startTimer() {
  timerStarted = true;
  timerInterval = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    timerDisplay.textContent = `Time: ${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// Info Modal Logic
const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");
const closeBtn = document.querySelector(".close");

infoBtn.onclick = () => (infoModal.style.display = "block");
closeBtn.onclick = () => (infoModal.style.display = "none");
window.onclick = e => {
  if (e.target === infoModal) infoModal.style.display = "none";
};

// Initialize game
initBoard();
renderBoard();
