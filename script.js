const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const width = 8;
const candyColors = [
    '#ff6384', // pink
    '#36a2eb', // blue
    '#ffce56', // yellow
    '#4bc0c0', // teal
    '#9966ff', // purple
    '#ff9f40'  // orange
];
let squares = [];
let score = 0;
let draggedCandy = null;
let replacedCandy = null;

// Create Board
function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
        square.style.backgroundColor = randomColor;
        square.classList.add('candy');
        board.appendChild(square);
        squares.push(square);
    }
}

// Drag events
squares.forEach = function(cb) { Array.prototype.forEach.call(this, cb); };

function addDragEvents() {
    squares.forEach(square => {
        square.addEventListener('dragstart', dragStart);
        square.addEventListener('dragend', dragEnd);
        square.addEventListener('dragover', e => e.preventDefault());
        square.addEventListener('dragenter', e => e.preventDefault());
        square.addEventListener('drop', dragDrop);
    });
}

function dragStart() {
    draggedCandy = this;
}

function dragDrop() {
    replacedCandy = this;
}

function swapCandyWithAnimation(fromIdx, toIdx) {
    const from = squares[fromIdx];
    const to = squares[toIdx];
    if (!from || !to) return;
    from.classList.add('moving');
    to.classList.add('moving');
    // Get positions
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const dx = toRect.left - fromRect.left;
    const dy = toRect.top - fromRect.top;
    // Animate
    from.style.transform = `translate(${dx}px, ${dy}px)`;
    to.style.transform = `translate(${-dx}px, ${-dy}px)`;
    setTimeout(() => {
        from.style.transform = '';
        to.style.transform = '';
        from.classList.remove('moving');
        to.classList.remove('moving');
        // Swap colors
        const tempColor = from.style.backgroundColor;
        from.style.backgroundColor = to.style.backgroundColor;
        to.style.backgroundColor = tempColor;
        checkBoard();
    }, 200);
}

function dragEnd() {
    if (!replacedCandy) return;
    const draggedId = parseInt(draggedCandy.id);
    const replacedId = parseInt(replacedCandy.id);
    const validMoves = [
        draggedId - 1,
        draggedId + 1,
        draggedId - width,
        draggedId + width
    ];
    if (validMoves.includes(replacedId)) {
        swapCandyWithAnimation(draggedId, replacedId);
    }
    replacedCandy = null;
    draggedCandy = null;
}

function animateRemove(indices) {
    indices.forEach(idx => squares[idx].classList.add('removed'));
    setTimeout(() => {
        indices.forEach(idx => squares[idx].classList.remove('removed'));
    }, 400);
}

// Check for matches
function checkRowForThree() {
    for (let i = 0; i < 62; i++) {
        let rowOfThree = [i, i+1, i+2];
        let decidedColor = squares[i].style.backgroundColor;
        const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55];
        if (notValid.includes(i)) continue;
        if (rowOfThree.every(idx => squares[idx].style.backgroundColor === decidedColor && decidedColor !== '')) {
            animateRemove(rowOfThree);
            rowOfThree.forEach(idx => squares[idx].style.backgroundColor = '');
            score += 3;
        }
    }
}

function checkColumnForThree() {
    for (let i = 0; i < 47; i++) {
        let columnOfThree = [i, i+width, i+width*2];
        let decidedColor = squares[i].style.backgroundColor;
        if (columnOfThree.every(idx => squares[idx].style.backgroundColor === decidedColor && decidedColor !== '')) {
            animateRemove(columnOfThree);
            columnOfThree.forEach(idx => squares[idx].style.backgroundColor = '');
            score += 3;
        }
    }
}

function moveDown() {
    for (let i = 0; i < 56; i++) {
        if (squares[i + width].style.backgroundColor === '') {
            squares[i + width].style.backgroundColor = squares[i].style.backgroundColor;
            squares[i].style.backgroundColor = '';
        }
    }
    for (let i = 0; i < width; i++) {
        if (squares[i].style.backgroundColor === '') {
            let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
            squares[i].style.backgroundColor = randomColor;
        }
    }
}

function checkBoard() {
    checkRowForThree();
    checkColumnForThree();
    moveDown();
    scoreDisplay.textContent = score;
}

// Game loop
function gameLoop() {
    checkBoard();
    setTimeout(gameLoop, 200);
}

createBoard();
addDragEvents();
gameLoop();
