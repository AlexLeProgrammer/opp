// Main script

"use strict";

// Import functions from multiplayerManager.js
import { newCell, getCellIndex, getLocalMap } from "./multiplayerManager.js"

//#region CONSTANTS

// Canvas
const CANVAS = document.querySelector("canvas");
CANVAS.width = 2000;
CANVAS.height = 2000;
const CANVAS_CLIENT = CANVAS.getBoundingClientRect();
const CTX = CANVAS.getContext("2d");

// Coordinates text
let coortext = document.querySelector(".coorText");

// Grid
const GRID_SIZE = 500;
const GRID_CELL_SIZE = 150;
const GRID_LINE_SIZE = 5;

// Colors
const COLORS_LIST = ["#2E86C1", "#3498DB", "#E74C3C", "#27AE60", "#F39C12", "#8E44AD", "#16A085", "#D35400"];

const COLOR_BOXES = [
    document.querySelector(".color-0"),
    document.querySelector(".color-1"),
    document.querySelector(".color-2"),
    document.querySelector(".color-3"),
    document.querySelector(".color-4"),
    document.querySelector(".color-5"),
    document.querySelector(".color-6"),
    document.querySelector(".color-7")
];

//#endregion

//#region VARIABLES

// Grid
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

    // Find the selected color
    for (let i = 0; i < COLOR_BOXES.length; i++) {
        if (COLOR_BOXES[i].classList.contains("selectedColor")) {
            selectedColor = i;
            break;
        }
    }

    //#endregion

    //#region DISPLAY

    // Clear the canvas
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Draw cells
    let map = getLocalMap();
    for (let cell of map) {
        CTX.fillStyle = cell.color;
        CTX.fillRect((cell.x * GRID_CELL_SIZE - gridGapX) * scale, (cell.y * GRID_CELL_SIZE - gridGapY) * scale, GRID_CELL_SIZE * scale, GRID_CELL_SIZE * scale);
    }

    // Draw selected cell
    CTX.fillStyle = COLORS_LIST[selectedColor];
    CTX.fillRect(Math.floor(((mouseX - CANVAS_CLIENT.x) * CANVAS.width / CANVAS_CLIENT.width - gridGapX) / GRID_CELL_SIZE) * GRID_CELL_SIZE / scale,
        Math.floor(((mouseY - CANVAS_CLIENT.y) * CANVAS.height / CANVAS_CLIENT.height - gridGapY) / GRID_CELL_SIZE) * GRID_CELL_SIZE / scale,
        GRID_CELL_SIZE * scale, GRID_CELL_SIZE * scale);

    // Draw the grid
    CTX.fillStyle = "grey";

    // Vertical lines
    for (let i = 0; i <= GRID_SIZE; i++) {
        CTX.fillRect((i * GRID_CELL_SIZE - gridGapX) * scale, 0, GRID_LINE_SIZE * scale, CANVAS.height);
    }

    // Horizontal lines
    for (let i = 0; i <= GRID_SIZE; i++) {
        CTX.fillRect(0, (i * GRID_CELL_SIZE - gridGapY) * scale, CANVAS.width, GRID_LINE_SIZE * scale);
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
    // Get the position of the mouse
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (mouseRightDown) {
        // Get the distance of the movement of the mouse and add it multiplied by the sensibility to the grid gap
        gridGapX -= e.movementX * CANVAS.width / CANVAS_CLIENT.width / scale;
        gridGapY -= e.movementY * CANVAS.height / CANVAS_CLIENT.height / scale;

        // Block movement at the beginning of the grid
        if (gridGapX < 0) {
            gridGapX = 0;
        }

        if (gridGapY < 0) {
            gridGapY = 0;
        }

        // Block movement at the end of the grid
        if (gridGapX > GRID_SIZE * GRID_CELL_SIZE - CANVAS.width) {
            gridGapX = GRID_SIZE * GRID_CELL_SIZE - CANVAS.width;
        }

        if (gridGapY > GRID_SIZE * GRID_CELL_SIZE - CANVAS.height) {
            gridGapY = GRID_SIZE * GRID_CELL_SIZE - CANVAS.height;
        }

        // Update coordinates text's html with the actual coordinates
        coortext.innerHTML = `Coordinate : X ${Math.floor(gridGapX / GRID_CELL_SIZE)}, Y ${Math.floor(gridGapY / GRID_CELL_SIZE)}`;
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