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
const COOR_TEXT = document.querySelector(".coorText");

// Color selector
const COLOR_SELECTOR = document.querySelector(".color-selector");

// Grid
const GRID_SIZE = 500;
const GRID_CELL_SIZE = 150;
const GRID_LINE_SIZE = 5;

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
let colorList = ["#2E86C1", "#3498DB", "#E74C3C", "#27AE60", "#F39C12", "#8E44AD", "#16A085", "#D35400"];
let selectedColor = 0;
let colorSelectorOpened = false;

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
    if (!colorSelectorOpened) {
        let canvasClient = CANVAS.getBoundingClientRect();
        CTX.fillStyle = colorList[selectedColor];
        CTX.fillRect(Math.floor(((mouseX - canvasClient.x) * CANVAS.width / canvasClient.width + gridGapX % GRID_CELL_SIZE * scale)
            / (GRID_CELL_SIZE * scale)) * GRID_CELL_SIZE * scale - gridGapX % GRID_CELL_SIZE * scale,
            Math.floor(((mouseY - canvasClient.y) * CANVAS.height / canvasClient.height + gridGapY % GRID_CELL_SIZE * scale)
                / (GRID_CELL_SIZE * scale)) * GRID_CELL_SIZE * scale - gridGapY % GRID_CELL_SIZE * scale,
            GRID_CELL_SIZE * scale, GRID_CELL_SIZE * scale);
    }


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
for (let i = 0; i < colorList.length; i++) {
    document.querySelector(`.color-${i}`).style.backgroundColor = colorList[i];
}

// Start the loop
setInterval(Update, 1000 / 60);

//#region INPUTS

// Keyboard
// Release
document.addEventListener("keyup", (e) => {
    // Open or close the color selector menu when we release space
    if (e.code === "Space") {
        if (!colorSelectorOpened) {
            document.querySelector(".color-selector").style.display = "block";
            COOR_TEXT.style.filter = "blur(1em)";
            CANVAS.style.filter = "blur(1em)";
            document.querySelector(".right-part").style.filter = "blur(1em)";
        } else {
            document.querySelector(".color-selector").style.display = "none";
            COOR_TEXT.style.filter = "none";
            CANVAS.style.filter = "none";
            document.querySelector(".right-part").style.filter = "none";

            // Set the color of all the colors box
            colorList[selectedColor] = document.querySelector(".color-selector input").value;
            for (let i = 0; i < colorList.length; i++) {
                document.querySelector(`.color-${i}`).style.backgroundColor = colorList[i];
            }
        }
        colorSelectorOpened = !colorSelectorOpened;
    }
})

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
        let canvasClient = CANVAS.getBoundingClientRect();
        gridGapX -= e.movementX * CANVAS.width / canvasClient.width / scale;
        gridGapY -= e.movementY * CANVAS.height / canvasClient.height / scale;

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
        COOR_TEXT.innerHTML = `Coordinate : X ${Math.floor(gridGapX / GRID_CELL_SIZE)}, Y ${Math.floor(gridGapY / GRID_CELL_SIZE)}`;
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