const boardElement = document.getElementById("board");
const resetBtn = document.getElementById("resetBtn");
const footer = document.getElementById("footer");
const timerElement = document.getElementById("timer");
const pegCountElement = document.getElementById("pegCount");
const rulesBtn = document.getElementById("rulesBtn");
const rulesModal = document.getElementById("rulesModal");
const closeModal = document.querySelector(".close");

let board = [];
let timer = null;
let seconds = 0;
let moveMade = false;

// Brainvita board layout (7x7 cross-shaped)
const initialBoard = [
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null]
];

function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      seconds++;
      timerElement.textContent = `Time: ${formatTime(seconds)}`;
    }, 1000);
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function renderBoard() {
  boardElement.innerHTML = "";
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const val = board[r][c];

      if (val !== null) {
        if (val === 1) {
          cell.classList.add("peg");
        } else {
          cell.classList.add("hole");
        }
        cell.addEventListener("click", () => handleClick(r, c));
      } else {
        cell.classList.add("blank");
      }

      boardElement.appendChild(cell);
    }
  }
}

let selected = null;

function handleClick(r, c) {
  if (!moveMade) {
    moveMade = true;
    startTimer();
  }

  if (selected) {
    const [sr, sc] = selected;

    const dr = Math.abs(r - sr);
    const dc = Math.abs(c - sc);

    if ((dr === 2 && dc === 0) || (dr === 0 && dc === 2)) {
      const mr = (r + sr) / 2;
      const mc = (c + sc) / 2;

      if (board[sr][sc] === 1 && board[r][c] === 0 && board[mr][mc] === 1) {
        board[sr][sc] = 0;
        board[mr][mc] = 0;
        board[r][c] = 1;
        selected = null;
        renderBoard();
        checkGameOver();
        return;
      }
    }
    selected = null;
  } else {
    if (board[r][c] === 1) {
      selected = [r, c];
    }
  }
}

function checkGameOver() {
  let possible = false;
  let pegCount = 0;

  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c] === 1) {
        pegCount++;

        // check all 4 directions
        const moves = [
          [r + 2, c, r + 1, c],
          [r - 2, c, r - 1, c],
          [r, c + 2, r, c + 1],
          [r, c - 2, r, c - 1]
        ];

        for (const [tr, tc, mr, mc] of moves) {
          if (
            tr >= 0 && tr < 7 && tc >= 0 && tc < 7 &&
            board[tr][tc] === 0 &&
            board[mr][mc] === 1
          ) {
            possible = true;
            break;
          }
        }
      }
    }
  }

  if (!possible) {
    clearInterval(timer);
    timer = null;
    pegCountElement.textContent = `Pegs Left: ${pegCount}`;
    if (pegCount === 1) {
      alert("Congratulations! Only one peg remains!");
    }
  }
}

function resetGame() {
  board = JSON.parse(JSON.stringify(initialBoard));
  selected = null;
  moveMade = false;
  seconds = 0;
  clearInterval(timer);
  timer = null;
  timerElement.textContent = "Time: 00:00";
  pegCountElement.textContent = "";
  renderBoard();
}

resetBtn.addEventListener("click", resetGame);

// Modal toggle
rulesBtn.addEventListener("click", () => {
  rulesModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  rulesModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === rulesModal) rulesModal.style.display = "none";
});

resetGame();
