// functions for working with elements

function getOne(element) {
  return document.querySelector(element);
}

function getAll(element) {
  return document.querySelectorAll(element);
}

function createElement(tag) {
  return document.createElement(tag);
}

function addClass(element, newClass) {
  element.classList.add(newClass);
}

function removeClass(element, delClass) {
  element.classList.remove(delClass);
}

function plugHtml(fatherElement, sonElement) {
  fatherElement.appendChild(sonElement);
}

// universal variables

const user = {
  paintingColor: 'black',
  boardSize: '',
};

// functions for the project

function getElementSize(element) {
  const elementWidth = getComputedStyle(getOne(element)).width;
  const elementHeight = getComputedStyle(getOne(element)).height;

  return [parseInt(elementWidth), parseInt(elementHeight)];
}

function generatorSize(element, numberOfElements) {
  const width = getElementSize(element)[0]/numberOfElements;
  const height = getElementSize(element)[1]/numberOfElements;

  return [width, height];
}

function validLimit(limit) {
  let newLimit = limit;
  if (limit > 50) {
    newLimit = 50;
  } else if (limit < 5) {
    newLimit = 5;
  }
  return newLimit;
}

function generatorPixelLine(limit) {
  const rows = getAll('.pixel-row');
  const validatedLimit = validLimit(limit);
  const width = generatorSize('#pixel-board', validatedLimit)[0];
  const height = generatorSize('#pixel-board', validatedLimit)[1];

  rows.forEach((row) => {
    for (let i = 0; i < validatedLimit; i += 1) {
      const pixel = createElement('div');
      addClass(pixel, 'pixel');
      pixel.style.width = `${width}px`;
      pixel.style.height = `${height}px`
      plugHtml(row, pixel);
    }
  });
}

function generatorPixelRow(limit) {
  const canvas = getOne('#pixel-board');
  const validatedLimit = validLimit(limit);

  for (let i = 0; i < validatedLimit; i += 1) {
    const row = createElement('div');
    addClass(row, 'pixel-row');
    plugHtml(canvas, row);
  }
}

function saveColor(color) {
  user.paintingColor = color;
}

function getColor() {
  const palette = getAll('.color');

  palette.forEach((color) => {
    color.addEventListener('click', (event) => {
      const selectColor = getComputedStyle(event.target).backgroundColor;
      saveColor(selectColor);
    });
  });
}

function paintingPixel() {
  const allPixels = getAll('.pixel');
  console.log(allPixels);

  allPixels.forEach((pixel) => {
    pixel.addEventListener('click', (event) => {
      const pixelColor = event.target.style;
      pixelColor.backgroundColor = user.paintingColor;
    });
  });
}

function resetSelection() {
  const selectedColor = getOne('.selected');
  removeClass(selectedColor, 'selected');
}

function changeSelection() {
  const palette = getAll('.color');

  palette.forEach((color) => {
    color.addEventListener('click', (event) => {
      resetSelection();
      addClass(event.target, 'selected');
    });
  });
}

function clearPainting() {
  const pixels = getAll('.pixel');
  const resetButton = getOne('#clear-board');

  resetButton.addEventListener('click', () => {
    pixels.forEach((pixel) => {
      const pixelColor = pixel.style;
      pixelColor.backgroundColor = 'white';
    });
  });
}

function customizeBoardSize() {
  const newBoardSize = getOne('#board-size');

  newBoardSize.addEventListener('input', (event) => {
    user.boardSize = event.target.value;
  });
}

function resetCanvas() {
  const board = getOne('#pixel-board');
  const allPixels = getAll('.pixel-row');

  allPixels.forEach((pixel) => {
    board.removeChild(pixel);
  });
}

function applyNewBoardSize() {
  const generateButton = getOne('#generate-board');

  generateButton.addEventListener('click', () => {
    if (user.boardSize === '') {
      alert('Board inválido!');
    } else {
      resetCanvas();
      generatorPixelRow(parseInt(user.boardSize, 10));
      generatorPixelLine(parseInt(user.boardSize, 10));
      paintingPixel();
      clearPainting();
    }
  });
}

function randomColorGenerator() {
  const colors = getAll('.color');

  for (let i = 1; i < colors.length; i += 1) {
    colors[i].style.backgroundColor = `rgb(${Math.random() * 255},
     ${Math.random() * 255},${Math.random() * 255})`;
  }
}

window.onload = () => {
  randomColorGenerator();
  generatorPixelRow(5);
  generatorPixelLine(5);
  getColor();
  paintingPixel();
  changeSelection();
  clearPainting();
  customizeBoardSize();
  applyNewBoardSize();
};
