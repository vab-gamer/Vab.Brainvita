// --- Board definitions ---
const BOARDS = {
  'english': {
    name: 'English Cross',
    rows: 7, cols: 7,
    grid: [
      [0,0,1,1,1,0,0],
      [0,0,1,1,1,0,0],
      [1,1,1,1,1,1,1],
      [1,1,1,2,1,1,1],
      [1,1,1,1,1,1,1],
      [0,0,1,1,1,0,0],
      [0,0,1,1,1,0,0]
    ],
    thumb: "https://i.imgur.com/9n1O9R2.png"
  },
  'european': {
    name: 'European',
    rows: 7, cols: 7,
    grid: [
      [0,1,1,1,1,1,0],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [1,1,1,2,1,1,1],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [0,1,1,1,1,1,0]
    ],
    thumb: "https://i.imgur.com/1hQZy3D.png"
  },
  'diamond': {
    name: 'Diamond',
    rows: 9, cols: 9,
    grid: [
      [0,0,0,0,1,0,0,0,0],
      [0,0,0,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,0],
      [1,1,1,1,2,1,1,1,1],
      [0,1,1,1,1,1,1,1,0],
      [0,0,1,1,1,1,1,0,0],
      [0,0,0,1,1,1,0,0,0],
      [0,0,0,0,1,0,0,0,0]
    ],
    thumb: "https://i.imgur.com/8cX6v7W.png"
  },
  'triangle': {
    name: 'Triangle',
    rows: 5, cols: 5,
    grid: [
      [0,0,0,0,1],
      [0,0,0,1,1],
      [0,0,1,1,1],
      [0,1,1,1,1],
      [2,1,1,1,1]
    ],
    thumb: "https://i.imgur.com/5VwA9nC.png"
  }
};
// --- State ---
let currentBoardKey = 'english';
let boardState = [];
let moveHistory = [];
let timerStarted = false;
let timerInterval = null;
let startTime = 0;
let elapsed = 0;
let gameEnded = false;
let highScore = null; // { pegs, time }
// --- DOM refs ---
const boardSelect = document.getElementById('boardSelect');
const gameBoard = document.getElementById('gameBoard');
const timerEl = document.getElementById('timer');
const pegCountEl = document.getElementById('pegCount');
const congratsMsg = document.getElementById('congratsMsg');
const highScoreMsg = document.getElementById('highScoreMsg');
const undoBtn = document.getElementById('undoBtn');
const resetBtn = document.getElementById('resetBtn');
const screenshotBtn = document.getElementById('screenshotBtn');
// --- Audio refs ---
const moveSound = document.getElementById('moveSound');
const winSound = document.getElementById('winSound');
const undoSound = document.getElementById('undoSound');
// --- Utility ---
function cloneBoard(board) {
  return board.map(row => row.slice());
}
function countPegs(board) {
  return board.flat().filter(x => x === 1).length;
}
function formatTime(ms) {
  const t = Math.floor(ms / 1000);
  const min = String(Math.floor(t / 60)).padStart(2, '0');
  const sec = String(t % 60).padStart(2, '0');
  return `${min}:${sec}`;
}
// --- Timer ---
function startTimer() {
  if (timerStarted) return;
  timerStarted = true;
  startTime = Date.now() - elapsed;
  timerInterval = setInterval(() => {
    elapsed = Date.now() - startTime;
    timerEl.textContent = `⏳ ${formatTime(elapsed)}`;
  }, 400);
}
function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  timerStarted = false;
}
function resetTimer() {
  stopTimer();
  elapsed = 0;
  timerEl.textContent = `⏳ 00:00`;
}
// --- Board Selection ---
function renderBoardSelect() {
  boardSelect.innerHTML = '';
  Object.entries(BOARDS).forEach(([key, val]) => {
    const div = document.createElement('div');
    div.className = 'board-thumb' + (key === currentBoardKey ? ' selected' : '');
    div.title = val.name;
    div.tabIndex = 0;
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', val.name);
    const img = document.createElement('img');
    img.src = val.thumb;
    img.alt = val.name;
    div.appendChild(img);
    div.onclick = () => {
      if (currentBoardKey !== key) {
        currentBoardKey = key;
        resetGame();
        renderBoardSelect();
      }
    };
    boardSelect.appendChild(div);
  });
}
// --- Board Rendering ---
let selectedPeg = null;
function renderBoard(animateMove = null) {
  const board = boardState;
  const rows = board.length, cols = board[0].length;
  const grid = document.createElement('div');
  grid.className = 'board-grid';
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'peg-cell' + (board[r][c] === 0 ? ' inactive' : '');
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (board[r][c] === 1) {
        const peg = document.createElement('div');
        peg.className = 'peg-marble' + (selectedPeg && selectedPeg[0] === r && selectedPeg[1] === c ? ' selected' : '');
        peg.tabIndex = 0;
        peg.setAttribute('role', 'button');
        peg.setAttribute('aria-label', 'Peg');
        peg.onclick = () => {
          if (gameEnded) return;
          if (selectedPeg && selectedPeg[0] === r && selectedPeg[1] === c) {
            selectedPeg = null;
            renderBoard();
          } else {
            selectedPeg = [r, c];
            renderBoard();
          }
        };
        cell.appendChild(peg);
      } else if (board[r][c] === 2) {
        const empty = document.createElement('div');
        empty.className = 'peg-empty';
        empty.tabIndex = 0;
        empty.setAttribute('role', 'button');
        empty.setAttribute('aria-label', 'Empty Hole');
        empty.onclick = () => {
          if (gameEnded || !selectedPeg) return;
          const [sr, sc] = selectedPeg;
          if (isValidMove(sr, sc, r, c)) {
            doMove(sr, sc, r, c, true);
          } else {
            selectedPeg = null;
            renderBoard();
          }
        };
        cell.appendChild(empty);
      }
      grid.appendChild(cell);
    }
  }
  gameBoard.innerHTML = '';
  gameBoard.appendChild(grid);
  // Animate if needed
  if (animateMove) {
    const [from, over, to] = animateMove;
    const fromCell = grid.children[from[0]*cols + from[1]].firstChild;
    const toCell = grid.children[to[0]*cols + to[1]].firstChild;
    if (fromCell && toCell) {
      fromCell.classList.add('animating');
      const dx = (to[1] - from[1]) * fromCell.offsetWidth;
      const dy = (to[0] - from[0]) * fromCell.offsetHeight;
      fromCell.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
      setTimeout(() => {
        renderBoard();
      }, 350);
    }
  }
}
// --- Move Logic ---
function isValidMove(sr, sc, er, ec) {
  if (boardState[er][ec] !== 2) return false;
  if (sr === er && Math.abs(sc - ec) === 2) {
    const mid = (sc + ec) / 2;
    return boardState[sr][mid] === 1;
  }
  if (sc === ec && Math.abs(sr - er) === 2) {
    const mid = (sr + er) / 2;
    return boardState[mid][sc] === 1;
  }
  // For triangle: allow diagonal moves
  if (currentBoardKey === 'triangle') {
    if (Math.abs(sr - er) === 2 && Math.abs(sc - ec) === 2) {
      const midr = (sr + er) / 2, midc = (sc + ec) / 2;
      return boardState[midr][midc] === 1;
    }
  }
  return false;
}
function doMove(sr, sc, er, ec, playSound = false) {
  const over = [(sr + er) / 2, (sc + ec) / 2];
  moveHistory.push({
    board: cloneBoard(boardState),
    selectedPeg: selectedPeg ? [...selectedPeg] : null,
    timerStarted,
    elapsed
  });
  boardState[sr][sc] = 2;
  boardState[over[0]][over[1]] = 2;
  boardState[er][ec] = 1;
  selectedPeg = null;
  renderBoard([[sr, sc], over, [er, ec]]);
  if (playSound) {
    moveSound.currentTime = 0;
    moveSound.play();
  }
  if (!timerStarted) startTimer();
  setTimeout(() => {
    updatePegCount();
    checkGameEnd();
  }, 350);
}
// --- Undo/Reset ---
function undoMove() {
  if (moveHistory.length === 0) return;
  const last = moveHistory.pop();
  boardState = cloneBoard(last.board);
  selectedPeg = last.selectedPeg;
  timerStarted = last.timerStarted;
  elapsed = last.elapsed;
  if (!timerStarted) stopTimer();
  else startTimer();
  renderBoard();
  updatePegCount();
  congratsMsg.style.display = 'none';
  highScoreMsg.style.display = 'none';
  undoSound.currentTime = 0;
  undoSound.play();
}
function resetGame() {
  const boardDef = BOARDS[currentBoardKey];
  boardState = cloneBoard(boardDef.grid);
  moveHistory = [];
  selectedPeg = null;
  gameEnded = false;
  congratsMsg.style.display = 'none';
  highScoreMsg.style.display = 'none';
  resetTimer();
  renderBoard();
  updatePegCount();
}
// --- Peg Count, Game End, High Score ---
function updatePegCount() {
  const pegs = countPegs(boardState);
  pegCountEl.textContent = `Pegs Left: ${pegs}`;
  pegCountEl.classList.toggle('bold', gameEnded);
}
function hasMoves() {
  const rows = boardState.length, cols = boardState[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (boardState[r][c] !== 1) continue;
      if (r >= 2 && boardState[r-1][c] === 1 && boardState[r-2][c] === 2) return true;
      if (r <= rows-3 && boardState[r+1][c] === 1 && boardState[r+2][c] === 2) return true;
      if (c >= 2 && boardState[r][c-1] === 1 && boardState[r][c-2] === 2) return true;
      if (c <= cols-3 && boardState[r][c+1] === 1 && boardState[r][c+2] === 2) return true;
      if (currentBoardKey === 'triangle') {
        if (r >= 2 && c >= 2 && boardState[r-1][c-1] === 1 && boardState[r-2][c-2] === 2) return true;
        if (r <= rows-3 && c <= cols-3 && boardState[r+1][c+1] === 1 && boardState[r+2][c+2] === 2) return true;
        if (r >= 2 && c <= cols-3 && boardState[r-1][c+1] === 1 && boardState[r-2][c+2] === 2) return true;
        if (r <= rows-3 && c >= 2 && boardState[r+1][c-1] === 1 && boardState[r+2][c-2] === 2) return true;
      }
    }
  }
  return false;
}
function checkGameEnd() {
  const pegs = countPegs(boardState);
  if (!hasMoves()) {
    gameEnded = true;
    stopTimer();
    pegCountEl.classList.add('bold');
    if (pegs === 1) {
      congratsMsg.style.display = 'block';
      winSound.currentTime = 0;
      winSound.play();
    }
    if (!highScore || pegs < highScore.pegs || (pegs === highScore.pegs && elapsed < highScore.time)) {
      highScore = { pegs, time: elapsed };
      localStorage.setItem('bv_highscore', JSON.stringify({ key: currentBoardKey, pegs, time: elapsed }));
      highScoreMsg.style.display = 'block';
      setTimeout(() => highScoreMsg.style.display = 'none', 2000);
    }
  }
}
function loadHighScore() {
  const data = localStorage.getItem('bv_highscore');
  if (data) {
    const hs = JSON.parse(data);
    if (hs.key === currentBoardKey) highScore = { pegs: hs.pegs, time: hs.time };
    else highScore = null;
  } else highScore = null;
}
// --- Screenshot ---
screenshotBtn.onclick = () => {
  html2canvas(gameBoard, {backgroundColor: null}).then(canvas => {
    const link = document.createElement('a');
    link.download = `VabBrainvita_${BOARDS[currentBoardKey].name.replace(/\s+/g,'')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
};
// --- Button Events ---
undoBtn.onclick = undoMove;
resetBtn.onclick = resetGame;
// --- Init ---
function init() {
  renderBoardSelect();
  loadHighScore();
  resetGame();
}
window.onload = init;
window.onbeforeunload = function() {
  localStorage.removeItem('bv_highscore');
};
    
