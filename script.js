const boardElement = document.getElementById("board");
const resetBtn = document.getElementById("resetBtn");

let board = [];

const template = [
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null],
];

function createBoard() {
  board = template.map(row => [...row]);
  renderBoard();
}

function renderBoard() {
  boardElement.innerHTML = "";
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      const val = board[r][c];
      if (val === 1) {
        const peg = document.createElement("div");
        peg.classList.add("peg");
        cell.appendChild(peg);
      } else if (val === 0 && template[r][c] === 1) {
        const hole = document.createElement("div");
        hole.classList.add("hole");
        cell.appendChild(hole);
      }

      boardElement.appendChild(cell);
    }
  }
}

resetBtn.onclick = createBoard;

createBoard();
