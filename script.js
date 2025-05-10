const initialBoard = [
  [2, 2, 1, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 2, 2],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [2, 2, 1, 1, 1, 2, 2],
  [2, 2, 1, 1, 1, 2, 2],
];

let boardState = JSON.parse(JSON.stringify(initialBoard));
let selected = null;

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let row = 0; row < boardState.length; row++) {
    for (let col = 0; col < boardState[row].length; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (boardState[row][col] === 1) {
        cell.classList.add("peg");
      } else if (boardState[row][col] === 0) {
        cell.classList.add("hole");
      } else {
        cell.style.visibility = "hidden";
      }

      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.onclick = () => handleClick(row, col);
      board.appendChild(cell);
    }
  }
}

function handleClick(row, col) {
  if (selected) {
    const [sr, sc] = selected;
    if (isValidMove(sr, sc, row, col)) {
      makeMove(sr, sc, row, col);
    }
    selected = null;
  } else if (boardState[row][col] === 1) {
    selected = [row, col];
  }
  renderBoard();
}

function isValidMove(sr, sc, er, ec) {
  const dr = er - sr;
  const dc = ec - sc;

  if (Math.abs(dr) === 2 && dc === 0) {
    const mr = sr + dr / 2;
    return boardState[er][ec] === 0 && boardState[mr][sc] === 1;
  }

  if (Math.abs(dc) === 2 && dr === 0) {
    const mc = sc + dc / 2;
    return boardState[er][ec] === 0 && boardState[sr][mc] === 1;
  }

  return false;
}

function makeMove(sr, sc, er, ec) {
  boardState[er][ec] = 1;
  boardState[sr][sc] = 0;
  boardState[(sr + er) / 2][(sc + ec) / 2] = 0;
}

renderBoard();
