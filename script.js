const board = document.getElementById("board");
const movesDisplay = document.getElementById("moves");
let moveCount = 0;

const layout = [
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null],
];

function createBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (layout[r][c] === null) {
        cell.style.visibility = "hidden";
      } else if (layout[r][c] === 1) {
        const marble = document.createElement("div");
        marble.classList.add("marble");
        marble.onclick = () => selectMarble(r, c);
        cell.appendChild(marble);
      } else {
        cell.classList.add("empty");
      }
      board.appendChild(cell);
    }
  }
}

let selected = null;

function selectMarble(r, c) {
  clearHighlights();
  selected = { r, c };
  const moves = getValidMoves(r, c);
  for (const move of moves) {
    const cell = document.querySelector(`.cell[data-row="${move.r}"][data-col="${move.c}"]`);
    cell.classList.add("valid-move");
    cell.onclick = () => makeMove(r, c, move.r, move.c);
  }
}

function getValidMoves(r, c) {
  const directions = [
    { dr: -2, dc: 0 }, { dr: 2, dc: 0 },
    { dr: 0, dc: -2 }, { dr: 0, dc: 2 }
  ];
  const moves = [];
  for (const { dr, dc } of directions) {
    const nr = r + dr;
    const nc = c + dc;
    const mr = r + dr / 2;
    const mc = c + dc / 2;
    if (
      layout[nr]?.[nc] === 0 &&
      layout[mr][mc] === 1
    ) {
      moves.push({ r: nr, c: nc, jumped: { r: mr, c: mc } });
    }
  }
  return moves;
}

function makeMove(fromR, fromC, toR, toC) {
  const jumped = {
    r: (fromR + toR) / 2,
    c: (fromC + toC) / 2
  };

  layout[fromR][fromC] = 0;
  layout[jumped.r][jumped.c] = 0;
  layout[toR][toC] = 1;

  moveCount++;
  movesDisplay.textContent = `Moves: ${moveCount}`;
  selected = null;
  clearHighlights();
  createBoard();
}

function clearHighlights() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.classList.remove("valid-move");
    cell.onclick = null;
  });
}

document.getElementById("resetBtn").onclick = () => {
  location.reload();
};

createBoard();
