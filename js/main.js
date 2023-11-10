// Main script

"use strict";

// Import functions from multiplayerManager.js
import { newCell, getCellIndex, getLocalMap } from "./multiplayerManager.js"

//#region CONSTANTS

// Canvas
const CANVAS = document.querySelector("canvas");
CANVAS.width = 2000;
CANVAS.height = 2000;

const CTX = CANVAS.getContext("2d");

// Coordinates text
let coortext = document.querySelector(".coorText");

// Grid
const GRID_SIZE = 500;
const DEFAULT_GRID_CELL_SIZE = 150;
const DEFAULT_GRID_LINE_SIZE = 5;

// Colors
const COLORS_LIST = ["#2E86C1", "#3498DB", "#E74C3C", "#27AE60", "#F39C12", "#8E44AD", "#16A085", "#D35400"];

//#endregion

//#region VARIABLES

// Grid
let gridCellSize = DEFAULT_GRID_CELL_SIZE;
let gridLineSize = DEFAULT_GRID_LINE_SIZE;
let scale = 1;

// Mouse
let mouseRightDown = false;

let mouseX = 0;
let mouseY = 0;

let gridGapX = 0;
let gridGapY = 0;

// Colors
let selectedColor = 0;

//#endregion

// Called every frame
function Update() {
    //#region DRAW



    //#endregion

    //#region DISPLAY

    // Clear the canvas
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Draw cells
    let map = getLocalMap();
    for (let cell of map) {
        CTX.fillStyle = cell.color;
        CTX.fillRect((cell.x * gridCellSize - gridGapX) * scale, (cell.y * gridCellSize - gridGapY) * scale, gridCellSize * scale, gridCellSize * scale);
    }

    // Draw the grid
    CTX.fillStyle = "grey";

    // Vertical lines
    for (let i = 0; i <= GRID_SIZE; i++) {
        CTX.fillRect((i * gridCellSize - gridGapX) * scale, 0, gridLineSize * scale, CANVAS.height);
    }

    // Horizontal lines
    for (let i = 0; i <= GRID_SIZE; i++) {
        CTX.fillRect(0, (i * gridCellSize - gridGapY) * scale, CANVAS.width, gridLineSize * scale);
    }

    //#endregion
}

// Set the color of all the colors box
for (let i = 0; i < COLORS_LIST.length; i++) {
    document.querySelector(`.color-${i}`).style.backgroundColor = COLORS_LIST[i];
}

// Start the loop
setInterval(Update, 1000 / 60);

//#region INPUTS

// Mouse right-click

// Press
CANVAS.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
        mouseRightDown = true;
    }
})

// Release
CANVAS.addEventListener("mouseup", (e) => {
    if (e.button === 2) {
        mouseRightDown = false;
    }
});

// Mouse movement
CANVAS.addEventListener("mousemove", (e) => {
    if (mouseRightDown) {
        // Get the position of the mouse
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Get the distance of the movement of the mouse and add it multiplied by the sensibility to the grid gap
        let canvasRect = CANVAS.getBoundingClientRect();
        gridGapX -= e.movementX * CANVAS.width / canvasRect.width / scale;
        gridGapY -= e.movementY * CANVAS.height / canvasRect.height / scale;

        // Block movement at the beginning of the grid
        if (gridGapX < 0) {
            gridGapX = 0;
        }

        if (gridGapY < 0) {
            gridGapY = 0;
        }

        // Block movement at the end of the grid
        if (gridGapX > GRID_SIZE * gridCellSize - CANVAS.width) {
            gridGapX = GRID_SIZE * gridCellSize - CANVAS.width;
        }

        if (gridGapY > GRID_SIZE * gridCellSize - CANVAS.height) {
            gridGapY = GRID_SIZE * gridCellSize - CANVAS.height;
        }

        // Update coordinates text's html with the actual coordinates
        coortext.innerHTML = `Coordinate : X ${Math.floor(gridGapX / gridCellSize)}, Y ${Math.floor(gridGapY / gridCellSize)}`;
    }
});

// Zoom
CANVAS.addEventListener("wheel", (e) => {
    scale += e.deltaY * -0.001;

    // Block zoom
    if (scale < 0.1) {
        scale = 0.1;
    }
});

//#endregion