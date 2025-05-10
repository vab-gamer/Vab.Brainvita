const boardLayout = [
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
];

let board = [];
const gameBoard = document.getElementById("gameBoard");
const resetBtn = document.getElementById("resetBtn");

function createBoard() {
  gameBoard.innerHTML = "";
  board = JSON.parse(JSON.stringify(boardLayout));

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (board[row][col] === 1) {
        const peg = document.createElement("div");
        peg.classList.add("peg");
        peg.dataset.row = row;
        peg.dataset.col = col;
        peg.onclick = () => handlePegClick(row, col);
        cell.appendChild(peg);
      } else if (board[row][col] === 0 && isValidCell(row, col)) {
        const hole = document.createElement("div");
        hole.classList.add("hole");
        cell.appendChild(hole);
      }

      gameBoard.appendChild(cell);
    }
  }
}

function isValidCell(row, col) {
  return boardLayout[row][col] === 1;
}

function handlePegClick(row, col) {
  // Placeholder logic for click
  console.log(`Peg at ${row}, ${col} clicked`);
}

resetBtn.onclick = createBoard;
createBoard();
