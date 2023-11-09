/*
* @author      Alex Etienne
* @version     1.0
* @since       2023-11-09
*/

"use strict";

//#region CONSTANTS

// Canvas
const CANVAS = document.querySelector("canvas");
CANVAS.width = 2000;
CANVAS.height = 2000;

const CTX = CANVAS.getContext("2d");

// Coordinates text
let coortext = document.querySelector(".coorText");

// Grid
const GRID_SIZE = 64;
const GRID_CELL_SIZE = 150;
const GRID_LINE_SIZE = 5;

// Mouse
const SENSIBILITY = 2;

//#endregion

//#region VARIABLES

// Mouse
let mouseRightDown = false;

let mouseX = 0;
let mouseY = 0;

let gridGapX = 0;
let gridGapY = 0;

//#endregion

// Called every frame
function Update() {
    //#region DISPLAY

    // Clear the canvas
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Draw the grid
    CTX.fillStyle = "grey";

    // Vertical lines
        for (let i = 0; i <= GRID_SIZE; i++) {
            CTX.fillRect(i * GRID_CELL_SIZE - gridGapX, 0, GRID_LINE_SIZE, CANVAS.height);
        }

    // Horizontal lines
        for (let i = 0; i <= GRID_SIZE; i++) {
            CTX.fillRect(0, i * GRID_CELL_SIZE - gridGapY, CANVAS.width, GRID_LINE_SIZE);
        }

    //#endregion
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
        gridGapX -= e.movementX * SENSIBILITY;
        gridGapY -= e.movementY * SENSIBILITY;

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

//#endregion