document.addEventListener('DOMContentLoaded', () => {
    const DIFFICULTIES = [
        { name: 'beginner', height: 8, width: 8, totalMines: 10 },
        { name: 'intermediate', height: 16, width: 16, totalMines: 40 },
        { name: 'expert', height: 16, width: 30, totalMines: 99 }
    ];

    const TILE_STATUSES = {
        HIDDEN: 'hidden',
        MINE: 'mine',
        REVEALED: 'revealed',
        FLAGGED: 'flagged'
    };

    let firstClick = true;

    function getDifficultySettings(difficulty) {
        const settings = DIFFICULTIES.find(level => level.name === difficulty);
        return settings ? settings : null;
    }

    function randomNumber(size) {
        return Math.floor(Math.random() * size);
    }

    function createBoard(height, width, totalMines) {
        const board = [];
        const minePositions = getMinePositions(height, width, totalMines);

        for (let i = 0; i < height; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                const element = document.createElement('div');
                element.dataset.status = TILE_STATUSES.HIDDEN;

                const tile = {
                    element,
                    i,
                    j,
                    has_mine: minePositions.some(positionMatch.bind(null, { i, j })),

                    get status() {
                        return this.element.dataset.status;
                    },
                    set status(value) {
                        this.element.dataset.status = value;
                    }
                };

                row.push(tile);
            }
            board.push(row);
        }
        return board;
    }

    function positionMatch(a, b) {
        return a.i === b.i && a.j === b.j;
    }

    function getMinePositions(height, width, totalMines) {
        const positions = [];

        while (positions.length < totalMines) {
            const position = {
                i: randomNumber(height),
                j: randomNumber(width)
            };

            if (!positions.some(positionMatch.bind(null, position))) {
                positions.push(position);
            }
        }

        return positions;
    }

    function revealTile(board, tile) {
        if (firstClick) {
            if (tile.has_mine) {
                const newMinePosition = {
                    i: randomNumber(board.length),
                    j: randomNumber(board[0].length)
                };

                while (tile.i === newMinePosition.i && tile.j === newMinePosition.j) {
                    newMinePosition.i = randomNumber(board.length);
                    newMinePosition.j = randomNumber(board[0].length);
                }

                const newTile = board[newMinePosition.i][newMinePosition.j];
                tile.has_mine = false;
                newTile.has_mine = true;
            }
            firstClick = false;
        }

        if (tile.status != TILE_STATUSES.HIDDEN) return;

        if (tile.has_mine) {
            tile.status = TILE_STATUSES.MINE;
            return;
        }

        tile.status = TILE_STATUSES.REVEALED;
        const adjacentTiles = nearbyTiles(board, tile);
        const mines = adjacentTiles.filter(t => t.has_mine);

        if (mines.length === 0) {
            adjacentTiles.forEach(revealTile.bind(null, board));
        } else {
            tile.element.textContent = mines.length;
        }
    }

    function flagTile(tile) {
        if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.FLAGGED) return;

        if (tile.status === TILE_STATUSES.FLAGGED) tile.status = TILE_STATUSES.HIDDEN;
        else tile.status = TILE_STATUSES.FLAGGED;
    }

    function listMinesLeft(board, totalMines) {
        const flaggedTilesCount = board.reduce((count, row) => {
            return count + row.filter(tile => tile.status === TILE_STATUSES.FLAGGED).length;
        }, 0);
        minesLeftText.textContent = totalMines - flaggedTilesCount;
    }

    function nearbyTiles(board, { i, j }) {
        const tiles = [];

        for (let iOffset = -1; iOffset <= 1; iOffset++)
            for (let jOffset = -1; jOffset <= 1; jOffset++) {
                if (iOffset === 0 && jOffset === 0) continue;
                const tile = board[i + iOffset]?.[j + jOffset];
                if (tile) tiles.push(tile);
            }

        return tiles;
    }

    function checkWin(board) {
        return board.every(row => {
            return row.every(tile => {
                return tile.status === TILE_STATUSES.REVEALED || (tile.has_mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.FLAGGED));
            });
        });
    }

    function checkLoss(board) {
        return board.some(row => {
            return row.some(tile => {
                return tile.status === TILE_STATUSES.MINE;
            });
        });
    }

    function checkGameEnd(board) {
        const is_win = checkWin(board);
        const is_loss = checkLoss(board);

        if (is_win || is_loss) {
            boardElement.addEventListener('mousedown', stopProp, { capture: true });
            boardElement.addEventListener('mouseup', stopProp, { capture: true });
            boardElement.addEventListener('contextmenu', stopProp, { capture: true });
        }

        if (is_win) {
            messageText.textContent = 'You Win!';
            board.forEach(row => {
                row.forEach(tile => {
                    if (tile.has_mine && tile.status !== TILE_STATUSES.FLAGGED) {
                        flagTile(tile);
                    }
                });
            });
        }

        if (is_loss) {
            messageText.textContent = 'You Lost!';
            board.forEach(row => {
                row.forEach(tile => {
                    if (tile.has_mine && tile.status !== TILE_STATUSES.FLAGGED) {
                        tile.element.dataset.status = TILE_STATUSES.MINE; 
                    }
                });
            });
        }
    }

    function stopProp(e) {
        e.stopImmediatePropagation();
    }

    function handleTileClick(board, tile) {
        if (tile.status === TILE_STATUSES.HIDDEN) {
            revealTile(board, tile);
            checkGameEnd(board);
        }
    }

    function handleTileRightClick(tile) {
        flagTile(tile);
        listMinesLeft(board, totalMines);
    }

    function handleTileChord(board, tile) {
        const flaggedNeighbors = nearbyTiles(board, tile).filter(t => t.status === TILE_STATUSES.FLAGGED);
        if (parseInt(tile.element.textContent) === flaggedNeighbors.length) {
            nearbyTiles(board, tile).forEach(neighbor => {
                if (neighbor.status === TILE_STATUSES.HIDDEN) {
                    revealTile(board, neighbor);
                    checkGameEnd(board);
                }
            });
        }
    }

    const selectedDifficulty = 'beginner';
    const { height, width, totalMines } = getDifficultySettings(selectedDifficulty);

    const board = createBoard(height, width, totalMines);
    const boardElement = document.querySelector('.board');
    const minesLeftText = document.querySelector('[mines-left]');
    const messageText = document.querySelector('.subtext');

    boardElement.style.setProperty('--board-height', height);
    boardElement.style.setProperty('--board-width', width);

    minesLeftText.textContent = totalMines;

    let isLeftButtonDown = false;
    let isRightButtonDown = false;

    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element);

            tile.element.addEventListener('mousedown', e => {
                e.preventDefault();
                if (e.button === 0) isLeftButtonDown = true; // Left button
                if (e.button === 2) isRightButtonDown = true; // Right button

                if (isLeftButtonDown && isRightButtonDown) {
                    handleTileChord(board, tile);
                } else if (isLeftButtonDown) {
                    handleTileClick(board, tile);
                } else if (isRightButtonDown) {
                    handleTileRightClick(tile);
                }
            });

            tile.element.addEventListener('mouseup', e => {
                e.preventDefault();
                if (e.button === 0) isLeftButtonDown = false; // Left button
                if (e.button === 2) isRightButtonDown = false; // Right button
            });

            tile.element.addEventListener('contextmenu', e => {
                e.preventDefault();
            });
        });
    });
});
