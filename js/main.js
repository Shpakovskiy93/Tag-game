const containerNode = document.getElementById('game');
const itemNodes = Array.from(containerNode.querySelectorAll('.game__item'));
const countItems = 16;

if(itemNodes.length !== 16) {
    throw new Error(`should be exactly ${countItems} items in HTML`)
}

// Position
itemNodes[countItems - 1].style.display = 'none';
let matrix = getMatrix(
    itemNodes.map(item => Number(item.dataset.matrixId))
)
setPositionItems(matrix);

//  Shuffle
document.getElementById('shuffle').addEventListener('click', () => {
    const shuffledArray = shuffleArray(matrix.flat());
    matrix = getMatrix(shuffledArray);
    setPositionItems(matrix);
})

// Change position by click
const blankNumber = 16;
containerNode.addEventListener('click', event => {
    const buttonNode = event.target.closest('button');
    if(!buttonNode) {
        return;
    }
    const buttonNumber = Number(buttonNode.dataset.matrixId);
    const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);

    const isValid = isValidForSwap(buttonCoords, blankCoords);
    if(isValid) {
        swap(blankCoords, buttonCoords, matrix);
        setPositionItems(matrix);
    }
})

// Change position by arrows
window.addEventListener('keydown', event => {
    if(!event.key.includes('Arrow')) {
        return;
    }

    const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
    const buttonCoords = {
        x: blankCoords.x,
        y: blankCoords.y,
    }
    
    const direction = event.key.split('Arrow')[1].toLowerCase();
    const maxIndexMatrix = matrix.length;
    switch (direction) {
        case 'up':
            buttonCoords.y += 1;
            break;
        case 'down':
            buttonCoords.y -= 1;
            break;
        case 'left':
            buttonCoords.x += 1;
            break;
        case 'right':
        buttonCoords.x -= 1;
        break;
    }
    if(buttonCoords.y >= maxIndexMatrix || buttonCoords.y < 0 ||
       buttonCoords.x >= maxIndexMatrix || buttonCoords.x < 0) {
        return;
    }

    swap(blankCoords, buttonCoords, matrix);
    setPositionItems(matrix);
})


// Helpers
function getMatrix(arr) {
    const matrix = [[], [], [], []];
    let y = 0;
    let x = 0;

    for(let i = 0; i < arr.length; i++) {
        if(x >= 4) {
            y++;
            x = 0;
        }
        matrix[y][x] = arr[i];
        x++;
    }

    return matrix;
}

function setPositionItems(matrix) {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            const value = matrix[y][x];
            const node = itemNodes[value - 1];
            setNodeStyles(node, x, y);
        }
    }
}

function setNodeStyles(node, x, y) {
    const shiftPs = 100;
    node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
}

function shuffleArray(arr) {
    return arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

function findCoordinatesByNumber(number, matrix) {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            if(matrix[y][x] === number) {
                return {x, y};
            }
        }
    }
    return null;
}

function isValidForSwap(coords1, coords2) {
    const diffX = Math.abs(coords1.x - coords2.x);
    const diffY = Math.abs(coords1.y - coords2.y);

    return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y);
}

function swap(coords1, coords2, matrix) {
    const coords1Number = matrix[coords1.y][coords1.x];
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
    matrix[coords2.y][coords2.x] = coords1Number;


    if(iswon(matrix)) {
        addWonClass();
    }
}

const winFlatArr = new Array(16).fill(0).map((item, i) => i + 1);
function iswon(matrix) {
    const flatMatrix = matrix.flat();
    for(let i = 0; i < winFlatArr.length; i++) {
        if(flatMatrix[i] !== winFlatArr[i]) {
            return false;
        }
    }

    return true;
}

const wonClass = 'won';
function addWonClass() {
    setTimeout(() => {
        containerNode.classList.add(wonClass);

        setTimeout(() => {
            containerNode.classList.remove(wonClass);
        }, 1000);
    }, 200);
}