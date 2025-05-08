const board = document.getElementById('board');
const moveCountDisplay = document.getElementById('move-count');
const resetButton = document.getElementById('reset');

let moveCount = 0;
let selectedPeg = null;
let boardState = [];

// Initialize the board with classic Brainvita layout
function initBoard() {
    // Create 7x7 grid (49 positions) but only use 33 valid holes
    boardState = Array(49).fill('invalid');
    
    // Define valid positions (33 holes in cross shape)
    const validPositions = [
        3, 9, 10, 11, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25,
        27, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 41, 42,
        43, 45, 46, 47, 48
    ];
    
    // Set all valid positions to 'peg' initially
    validPositions.forEach(pos => {
        boardState[pos] = 'peg';
    });
    
    // Center hole starts empty
    boardState[24] = 'empty';
    
    renderBoard();
    moveCount = 0;
    moveCountDisplay.textContent = moveCount;
}

// Render the board
function renderBoard() {
    board.innerHTML = '';
    boardState.forEach((state, index) => {
        const hole = document.createElement('div');
        hole.className = `hole ${state}`;
        hole.dataset.index = index;
        if (state !== 'invalid') {
            hole.addEventListener('click', () => handleClick(index));
        }
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
        if (isValidMove(selectedPeg, index)) {
            makeMove(selectedPeg, index);
        }
    }
}

// Check if move is valid
function isValidMove(from, to) {
    const diff = Math.abs(from - to);
    const step = (from < to) ? 1 : -1;
    
    // Must be vertical or horizontal jump over exactly one peg
    if (diff === 2 || diff === 14) {
        const middle = from + step * (diff / 2);
        return boardState[middle] === 'peg';
    }
    return false;
}

// Execute the move
function makeMove(from, to) {
    const diff = Math.abs(from - to);
    const step = (from < to) ? 1 : -1;
    const middle = from + step * (diff / 2);
    
    boardState[from] = 'empty';
    boardState[middle] = 'empty';
    boardState[to] = 'peg';
    
    moveCount++;
    moveCountDisplay.textContent = moveCount;
    selectedPeg = null;
    renderBoard();
    checkWin();
}

// Check win condition
function checkWin() {
    const pegsLeft = boardState.filter(state => state === 'peg').length;
    if (pegsLeft === 1 && boardState[24] === 'peg') {
        setTimeout(() => alert(`🎉 You won in ${moveCount} moves!`), 100);
    } else if (pegsLeft === 1) {
        setTimeout(() => alert("Game over! Last peg is not in center."), 100);
    }
}

// Reset button
resetButton.addEventListener('click', initBoard);

// Initialize game
initBoard();
