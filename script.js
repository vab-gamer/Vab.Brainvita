const board = document.getElementById('board');
const moveCountDisplay = document.getElementById('move-count');
const resetButton = document.getElementById('reset');

let moveCount = 0;
let selectedPeg = null;
let boardState = [];

// Initialize the board (Brainvita layout)
function initBoard() {
    boardState = Array(33).fill('peg'); // 0-32 positions
    boardState[16] = 'empty'; // Center hole is empty
    renderBoard();
}

// Render the board UI
function renderBoard() {
    board.innerHTML = '';
    boardState.forEach((state, index) => {
        const hole = document.createElement('div');
        hole.className = `hole ${state}`;
        hole.dataset.index = index;
        hole.addEventListener('click', () => handleClick(index));
        board.appendChild(hole);
    });
}

// Handle peg selection and moves
function handleClick(index) {
    if (boardState[index] === 'peg') {
        if (selectedPeg !== null) {
            document.querySelector(`.hole[data-index="${selectedPeg}"]`).classList.remove('selected');
        }
        selectedPeg = index;
        document.querySelector(`.hole[data-index="${index}"]`).classList.add('selected');
    } 
    else if (boardState[index] === 'empty' && selectedPeg !== null) {
        const moveValid = checkMove(selectedPeg, index);
        if (moveValid) {
            executeMove(selectedPeg, index);
        }
    }
}

// Check if a move is valid
function checkMove(from, to) {
    const diff = Math.abs(from - to);
    if (diff === 2 || diff === 14) { // Horizontal or vertical jump
        const middle = (from + to) / 2;
        return boardState[middle] === 'peg';
    }
    return false;
}

// Execute the move
function executeMove(from, to) {
    const middle = (from + to) / 2;
    boardState[from] = 'empty';
    boardState[middle] = 'empty';
    boardState[to] = 'peg';
    moveCount++;
    moveCountDisplay.textContent = moveCount;
    selectedPeg = null;
    renderBoard();
    checkWin();
}

// Check if the player wins
function checkWin() {
    const pegsLeft = boardState.filter(state => state === 'peg').length;
    if (pegsLeft === 1 && boardState[16] === 'peg') {
        alert('You won in ' + moveCount + ' moves!');
    } else if (pegsLeft === 1) {
        alert('Game over, but the last peg is not in the center!');
    }
}

// Reset the game
resetButton.addEventListener('click', initBoard);

// Start the game
initBoard();
