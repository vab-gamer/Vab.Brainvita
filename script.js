const board = document.getElementById('board');
const moveCountDisplay = document.getElementById('move-count');
const resetButton = document.getElementById('reset');

let moveCount = 0;
let selectedPeg = null;
let boardState = [];

// Initialize the board (Brainvita cross-shaped layout)
function initBoard() {
    boardState = Array(33).fill('empty'); // Start all empty

    // Fill pegs in valid positions (33-hole cross)
    const pegPositions = [
        0, 1, 2, 3, 4, 5, 6,
        7, 8, 9, 10, 11, 12, 13,
        14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26,
        27, 28, 29, 30, 31, 32
    ];

    pegPositions.forEach(pos => {
        boardState[pos] = 'peg';
    });

    // Center hole starts empty
    boardState[16] = 'empty';

    renderBoard();
    moveCount = 0;
    moveCountDisplay.textContent = moveCount;
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

// Check if a move is valid (horizontal/vertical jumps only)
function checkMove(from, to) {
    const rowFrom = Math.floor(from / 7);
    const colFrom = from % 7;
    const rowTo = Math.floor(to / 7);
    const colTo = to % 7;

    // Must jump exactly 2 steps in a straight line
    if (
        (Math.abs(rowFrom - rowTo) === 2 && colFrom === colTo) || // Vertical
        (Math.abs(colFrom - colTo) === 2 && rowFrom === rowTo)    // Horizontal
    ) {
        const middle = (from + to) / 2;
        return boardState[middle] === 'peg'; // Must have a peg in between
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

// Check if the player wins (last peg in center)
function checkWin() {
    const pegsLeft = boardState.filter(state => state === 'peg').length;
    if (pegsLeft === 1 && boardState[16] === 'peg') {
        alert(`🎉 You won in ${moveCount} moves!`);
    } else if (pegsLeft === 1) {
        alert("Game over! Last peg is not in the center.");
    }
}

// Reset the game
resetButton.addEventListener('click', initBoard);

// Start the game
initBoard();
