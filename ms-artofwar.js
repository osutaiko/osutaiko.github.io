

document.addEventListener('DOMContentLoaded', () => {
    const DIFFICULTY_SETTINGS = { width: 30, totalMines: 180 };

    const TILE_STATUSES = {
        HIDDEN: 'hidden',
        MINE: 'mine',
        REVEALED_P1: 'revealed-red',
        REVEALED_P2: 'revealed-blue',
        FLAGGED_P1: 'flagged-red',
        FLAGGED_P2: 'flagged-blue'
    };

    let board; // Variable to hold the game board

    /* DOM Elements */
    const infobarElement = document.querySelector('.board-info-bar');
    const boardElement = document.querySelector('.board');
    const statusButton = document.querySelector('#status-button');

    /* Event Listeners */
    const difficultyOptions = document.querySelectorAll('.difficulty-option');
    statusButton.addEventListener('click', () => {
        location.reload();
    });
    document.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            location.reload();
        }
    });

    /* Functions */

    function randomNumber(size) { // Returns integer in [0, size)
        return Math.floor(Math.random() * size);
    }

    function positionMatch(a, b) {
        return a.i === b.i && a.j === b.j;
    }

    function isInBaseArea(pos, width) {
        return (pos.i >= width - 5 && pos.j <= 4) || (pos.i <= 4 && pos.j >= width - 5) 
    }

    function getMinePositions(width, totalMines) { // Randomly generates mine locations (retries when mine already exists in list) and returns the list
        const positions = [];

        while (positions.length < totalMines) {
            const position = {
                i: randomNumber(width),
                j: randomNumber(width)
            };

            if (!positions.some(positionMatch.bind(null, position)) && !isInBaseArea(position, width)) {
                positions.push(position);
            }
        }

        return positions;
    }

    function createBoard(width, totalMines) {
        const minePositions = getMinePositions(width, totalMines);
        const newBoard = [];

        for (let i = 0; i < width; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                const element = document.createElement('div');
                element.dataset.status = TILE_STATUSES.HIDDEN;

                const tile = {
                    element,
                    i,
                    j,
                    hasMine: minePositions.some(positionMatch.bind(null, { i, j })),

                    get status() {
                        return this.element.dataset.status;
                    },
                    set status(value) {
                        this.element.dataset.status = value;
                    }
                };

                row.push(tile);
            }
            newBoard.push(row);
        }
        return newBoard;
    }

    function revealTile(tile) {
        lastRevealedTile = tile;

        if (tile.status != TILE_STATUSES.HIDDEN) return;

        if (tile.hasMine) {
            tile.status = TILE_STATUSES.MINE;
            return;
        }

        tile.status = TILE_STATUSES.REVEALED;
        const adjacentTiles = nearbyTiles(tile);
        const mines = adjacentTiles.filter(t => t.hasMine);

        if (mines.length === 0) {
            adjacentTiles.forEach(revealTile);
        } else { // Color code the numbers
            const numberColors = ['#4600ff', '#008809', '#ff0000', '#1e007c', '#8e0000', '#008483', '#000000', '#808080'];
            const number = mines.length;
            tile.element.textContent = number;
            tile.element.style.color = numberColors[number - 1];
        }
    }

    function flagTile(tile) { // Flag tile if tile is unflagged and v.v.
        if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.FLAGGED) return;

        if (tile.status === TILE_STATUSES.FLAGGED) tile.status = TILE_STATUSES.HIDDEN;
        else tile.status = TILE_STATUSES.FLAGGED;
    }

    function nearbyTiles({ i, j }) { // Returns list of adjacent tiles
        const tiles = [];

        for (let iOffset = -1; iOffset <= 1; iOffset++)
            for (let jOffset = -1; jOffset <= 1; jOffset++) {
                if (iOffset === 0 && jOffset === 0) continue;
                const tile = board[i + iOffset]?.[j + jOffset];
                if (tile) tiles.push(tile);
            }

        return tiles;
    }

    function stopProp(e) {
        e.stopImmediatePropagation();
    }

    function handleTileClick(tile) {
        if (tile.status === TILE_STATUSES.HIDDEN) {
            revealTile(tile);
        }
    }

    function handleTileRightClick(tile) {
        flagTile(tile);
    }

    function handleTileChord(tile) {
        const flaggedNeighbors = nearbyTiles(tile).filter(t => t.status === TILE_STATUSES.FLAGGED);
        if (parseInt(tile.element.textContent) === flaggedNeighbors.length) {
            nearbyTiles(tile).forEach(neighbor => {
                if (neighbor.status === TILE_STATUSES.HIDDEN) {
                    revealTile(neighbor);
                }
            });
        }
    }

    function toggleFlagOverlay() {
        board.forEach(row => {
            row.forEach(tile => {
                if (isRightClickToggled && tile.status === TILE_STATUSES.HIDDEN) {
                    tile.element.classList.add('overlay-flag');
                } else {
                    tile.element.classList.remove('overlay-flag');
                }
            });
        });
    }

    /* Game Initialization */
    const { width, totalMines } = DIFFICULTY_SETTINGS;

    board = createBoard(width, totalMines); // Create the game board

    boardElement.style.setProperty('--board-height', width);
    boardElement.style.setProperty('--board-width', width);
    infobarElement.style.setProperty('--board-width', width);

    difficultyOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedDifficulty = option.id;
            window.location.href = `${window.location.origin}${window.location.pathname}?difficulty=${selectedDifficulty}`;
        });
    });

    let isLeftButtonDown = false;
    let isRightButtonDown = false;

    var isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    var isRightClickToggled = false;
    //if (isTouchDevice)
    {
        var toggleClickButton = document.createElement('button');
        toggleClickButton.id = 'toggle-click';
        toggleClickButton.className = 'toggle-click';
        toggleClickButton.innerHTML = '⛏️';
        document.body.appendChild(toggleClickButton);
        toggleClickButton.addEventListener('click', () => {
            isRightClickToggled = !isRightClickToggled;
            toggleClickButton.textContent = isRightClickToggled ? '🚩' : '⛏️';
            toggleFlagOverlay();
        });
    }

    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element);

            tile.element.addEventListener('mousedown', e => {
                e.preventDefault();
                const thisButton = isRightClickToggled ? (2 - e.button) : e.button;
                if (thisButton === 0) { // LMB
                    isLeftButtonDown = true;
                }
                if (thisButton === 2) { // RMB
                    isRightButtonDown = true;
                    handleTileRightClick(tile);
                    toggleFlagOverlay();
                }
            });

            tile.element.addEventListener('mouseup', e => {
                e.preventDefault();
                const thisButton = isRightClickToggled ? (2 - e.button) : e.button;
                if (thisButton === 0) {
                    isLeftButtonDown = false;
                    if (isRightButtonDown) {
                        handleTileChord(tile);
                    } else {
                        handleTileClick(tile);
                    }
                } else if (thisButton === 1) {
                    handleTileChord(tile);
                } else if (thisButton === 2) {
                    isRightButtonDown = false;
                    if (isLeftButtonDown) {
                        handleTileChord(tile);
                    }
                }

                if (isTouchDevice && !isRightClickToggled && tile.status === TILE_STATUSES.REVEALED) {
                    handleTileChord(tile);
                }
            });

            tile.element.addEventListener('contextmenu', e => {
                e.preventDefault();
            });
        });
    });
});
