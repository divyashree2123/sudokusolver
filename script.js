document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const solveButton = document.getElementById('solve-button');
    const clearButton = document.getElementById('clear-button');
    const generateButton = document.getElementById('generate-button');
    const saveButton = document.getElementById('save-button');
    const difficultySelector = document.getElementById('difficulty-level');

    const difficulties = {
        easy: 40,
        medium: 30,
        hard: 20
    };

    function createBoard() {
        boardElement.querySelector('tbody').innerHTML = '';
        for (let row = 0; row < 9; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < 9; col++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.classList.add('cell');
                td.appendChild(input);
                tr.appendChild(td);
            }
            boardElement.querySelector('tbody').appendChild(tr);
        }
    }

    createBoard();

    function getBoard() {
        const board = [];
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('input');
            const rowArray = [];
            cells.forEach(cell => {
                const value = parseInt(cell.value);
                rowArray.push(isNaN(value) ? 0 : value);
            });
            board.push(rowArray);
        });
        return board;
    }

    function updateBoard(board) {
        const rows = document.querySelectorAll('tr');
        rows.forEach((row, i) => {
            const cells = row.querySelectorAll('input');
            cells.forEach((cell, j) => {
                cell.value = board[i][j] !== 0 ? board[i][j] : '';
                cell.disabled = board[i][j] !== 0;
            });
        });
    }

    function solveSudoku(board) {
        function isValid(board, row, col, num) {
            for (let i = 0; i < 9; i++) {
                if (board[row][i] === num || board[i][col] === num ||
                    board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + (i % 3)] === num) {
                    return false;
                }
            }
            return true;
        }

        function solve(board) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (isValid(board, row, col, num)) {
                                board[row][col] = num;
                                if (solve(board)) {
                                    return true;
                                }
                                board[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        solve(board);
        return board;
    }

    function generatePuzzle(level) {
        const board = Array.from({ length: 9 }, () => Array(9).fill(0));
        solveSudoku(board);
        const filledCells = difficulties[level];
        
        let remainingCells = 81 - filledCells;
        while (remainingCells > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                remainingCells--;
            }
        }

        return board;
    }

    solveButton.addEventListener('click', () => {
        const board = getBoard();
        if (solveSudoku(board)) {
            updateBoard(board);
        } else {
            alert('No solution exists for this Sudoku!');
        }
    });

    clearButton.addEventListener('click', () => {
        createBoard();
    });

    generateButton.addEventListener('click', () => {
        const selectedLevel = difficultySelector.value;
        const board = generatePuzzle(selectedLevel);
        updateBoard(board);
    });
});
