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

function removeOfHtml(fatherElement, sonElement) {
  fatherElement.removeChild(sonElement);
}

function addMultiplesEvents(element, eventsName, listener) {
  const events = eventsName.split(' ');

  events.forEach((event) => {
    element.addEventListener(event, listener, false);
  });
}

// universal variables

const user = {
  paintingColor: 'black',
  colorPalette: '',
  boardSize: '5',
  numberColor: 4,
  dragOn: false,
  eraser: false,
};

let allColors = getAll('.color');

// functions for variables

function attVariables() {
  allColors = getAll('.color');
}

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

function validLimit(min, max, limit) {
  let newLimit = limit;
  if (limit > max) {
    newLimit = max;
  } else if (limit < min) {
    newLimit = min;
  }
  return newLimit;
}

function generatorPixelLine(limit) {
  const rows = getAll('.pixel-row');
  const validatedLimit = validLimit(5, 100, limit);
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
  const validatedLimit = validLimit(5, 100, limit);

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
  allColors.forEach((color) => {
    color.addEventListener('click', (event) => {
      const selectColor = getComputedStyle(event.target).backgroundColor;
      saveColor(selectColor);
      changeSelection(event);
      resetEraser();
    });
  });
}

function generateDrag() {
  const pxs = getAll('.pixel');

  pxs.forEach((px) => {
    addMultiplesEvents(px, 'mousedown mouseup mouseover', dragAndColor)
  });
}

function controlDrag(event) {
  if(event.type === 'mousedown') {
    user.dragOn = true;
  } else if(event.type === 'mouseup') {
    user.dragOn = false;
  }
  const main = getOne('main');
  main.addEventListener('mouseup', () => {user.dragOn = false})
}

function dragAndColor(event) {
  controlDrag(event);

  if(user.dragOn && !user.eraser) {
    paintingPixel(event);
  } else if (user.dragOn && user.eraser) {
    erasePixel(event);
  }
}

function paintingPixel(event) {
  const pixelColor = event.target.style;
  pixelColor.backgroundColor = user.paintingColor;
}

function erasePixel(event) {
  const pixelColor = event.target.style;
  pixelColor.backgroundColor = 'white';
}

function resetEraser() {
  user.eraser = false;
  removeClass(getOne('#eraser'), 'eraser-active');
}

function resetSelection() {
  const selectedColor = getOne('.selected');
  if (selectedColor !== null) {
    removeClass(selectedColor, 'selected');
  }
}

function changeSelection(event) {
  resetSelection();
  addClass(event.target, 'selected');
}

function clearPainting() {
  const pixels = getAll('.pixel');
  const resetButton = getOne('#clear-board');

  resetButton.addEventListener('click', () => {
    resetEraser();
    pixels.forEach((pixel) => {
      const pixelColor = pixel.style;
      pixelColor.backgroundColor = 'white';
    });
  });
}

function getNumbersColors() {
  const nColors = getOne('#many-colors');

  nColors.addEventListener('keyup', (event) => {
    if (event.target.value === '') {
      user.numberColor = 4;
    } else if (event.which === 13) {
      generatePalette();
    } else {
      user.numberColor = validLimit(4, 32, event.target.value);
    }
  });
}

function resetColors() {
  const colorPalette = getOne('#color-palette');

  allColors.forEach((color) => {
    removeOfHtml(colorPalette, color);
  });
}

function generateColors() {
  const colorButton = getOne('#generate-colors');

  colorButton.addEventListener('click', generatePalette);
}

function generatePalette() {
  const colorPalette = getOne('#color-palette');

  resetColors();
  generateFirstPalette();
}

function generateFirstPalette() {
  const colorPalette = getOne('#color-palette');

  for (let i = 0; i < parseInt(user.numberColor, 10); i += 1) {
    const newColor = createElement('div');
    addClass(newColor, 'color');
    plugHtml(colorPalette, newColor);
  };
  attVariables();
  applyGeneratedColors();
  getColor();
  storeUserData();
}

function customizeBoardSize() {
  const newBoardSize = getOne('#board-size');

  newBoardSize.addEventListener('keyup', (event) => {
    user.boardSize = event.target.value;
    if (event.which === 13) {
      applyNewBoardSize();
      storeUserData();
    }
  });
}

function resetCanvas() {
  const board = getOne('#pixel-board');
  const allPixels = getAll('.pixel-row');

  allPixels.forEach((pixel) => {
    board.removeChild(pixel);
  });
}

function validateNewBoardSize() {
  const generateButton = getOne('#generate-board');

  generateButton.addEventListener('click', () => {
    if (user.boardSize === '') {
      alert('Board inválido!');
    } else {
      applyNewBoardSize();
      storeUserData();
    }
  });
}

function applyNewBoardSize() {
  resetCanvas();
  generatorPixelRow(parseInt(user.boardSize, 10));
  generatorPixelLine(parseInt(user.boardSize, 10));
  clearPainting();
  generateDrag();
}

function randomColorGenerator() {
  const colorArr = [];
  for (let i = 1; i < allColors.length; i += 1) {
    colorArr.push(`rgb(${Math.floor(Math.random() * 255)};${Math.floor(Math.random() * 255)};${Math.floor(Math.random() * 255)})`);
  }

  return colorArr;
}

function encodeColors(str) {
  return str.replaceAll(',', ';')
}

function decodeColors(str) {
  return str.toString().replaceAll(';', ',');
}

function applyGeneratedColors() {
  const newColors = randomColorGenerator();

  newColors.forEach((color, i) => {
    allColors[i + 1].style.backgroundColor = decodeColors(color);
  });
}

function applyUserColors() {
  const savedColors = user.colorPalette.split(',');

  savedColors.forEach((color, i) => {
    allColors[i + 1].style.backgroundColor = decodeColors(color)
  });
}

function changeToErase() {
  const eraser = getOne('#eraser');
  eraser.addEventListener('click', controlEraser);
}

function controlEraser(event) {
  if (user.eraser) {
    user.eraser = false;
    removeClass(event.target, 'eraser-active');
  } else {
    user.eraser = true;
    addClass(event.target, 'eraser-active');
  }
}

function getColorsData() {
  const saveArr = [];

  allColors.forEach((color) => {
    saveArr.push(encodeColors(color.style.backgroundColor));
  });

  return saveArr.slice(1);
}

function getBoardSizesData() {
  return user.boardSize;
}

function getPaletteSize() {
  return `${user.numberColor}`;
}

function controlUserData(key, data) {
  if (key in localStorage) {
    getUserData(key, data);
  } else {
    setUserData(key, data);
  }
}

function setUserData(key, data) {
  if (typeof key === 'string' && typeof data === 'string') {
    localStorage.setItem(key, data)
  } else {
    JSON.stringify(key);
    JSON.stringify(data);
    localStorage.setItem(key, data)
  }
}

function getUserData(key, data) {
  localStorage[key] = data;
}

function storeUserData() {
  controlUserData('colors', getColorsData());
  controlUserData('boardSize', getBoardSizesData());
  controlUserData('colorPaletteSize', getPaletteSize());
}

function restoreUserSection() {
  const userColors = localStorage.colors,
        boardSize = localStorage.boardSize,
        paletteSize = localStorage.colorPaletteSize;

  user.colorPalette = userColors;
  user.boardSize = boardSize;
  user.numberColor = paletteSize;
}

window.onload = () => {
  restoreUserSection();
  generateFirstPalette();
  applyUserColors();
  generatorPixelRow(user.boardSize);
  generatorPixelLine(user.boardSize);
  changeToErase();
  getColor();
  clearPainting();
  customizeBoardSize();
  getNumbersColors();
  generateColors();
  validateNewBoardSize();
  generateDrag();
  getColorsData();
  storeUserData();
};
