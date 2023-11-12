// Main script

"use strict";

// Import functions from multiplayerManager.js
import { newCell, removeCell, getLocalMap } from "./multiplayerManager.js"

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

// Help box
const HELP_TEXT = document.querySelector(".help-text");

// Grid
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
    document.querySelector(".color-7"),
    document.querySelector(".color-8")
];

//#endregion

//#region VARIABLES

// Grid
let scale = 1;

// Mouse
let mouseRightDown = false;

let mouseX = 0;
let mouseY = 0;

let selectedCellX = 0;
let selectedCellY = 0;

let gridGapX = 0;
let gridGapY = 0;

// Colors
let colorList = ["#2E86C1", "#3498DB", "#E74C3C", "#27AE60", "#F39C12", "#8E44AD", "#16A085", "#D35400"];
let selectedColor = 0;
let colorSelectorOpened = false;

// Help box
let helpOpened = false;

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

    // Calculate the position of the seleted cell
    let canvasClient = CANVAS.getBoundingClientRect();
    if (!colorSelectorOpened && !helpOpened) {
        selectedCellX = Math.floor(((mouseX - canvasClient.x) * CANVAS.width / canvasClient.width + gridGapX % GRID_CELL_SIZE * scale)
            / (GRID_CELL_SIZE * scale)) * GRID_CELL_SIZE * scale - gridGapX % GRID_CELL_SIZE * scale;
        selectedCellY = Math.floor(((mouseY - canvasClient.y) * CANVAS.height / canvasClient.height + gridGapY % GRID_CELL_SIZE * scale)
            / (GRID_CELL_SIZE * scale)) * GRID_CELL_SIZE * scale - gridGapY % GRID_CELL_SIZE * scale;
    }


    //#endregion

    //#region DISPLAY

    // Clear the canvas
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Draw cells
    let map = getLocalMap();
    for (let cell of map) {
        CTX.fillStyle = cell.color;
        CTX.fillRect((cell.x * GRID_CELL_SIZE - gridGapX) * scale, (cell.y * GRID_CELL_SIZE - gridGapY) * scale,
            GRID_CELL_SIZE * scale, GRID_CELL_SIZE * scale);
    }

    // Draw selected cell
    if (!colorSelectorOpened && !helpOpened && selectedColor !== 8) {
        CTX.fillStyle = colorList[selectedColor];
        CTX.fillRect(selectedCellX, selectedCellY, GRID_CELL_SIZE * scale, GRID_CELL_SIZE * scale);
    }


    // Draw the grid
    CTX.fillStyle = "grey";

    // Vertical lines
    for (let i = 0; i <= CANVAS.width / (GRID_CELL_SIZE * scale); i++) {
        CTX.fillRect((i * GRID_CELL_SIZE - gridGapX % (GRID_CELL_SIZE * scale)) * scale, 0, GRID_LINE_SIZE * scale, CANVAS.height);
    }

    // Horizontal lines
    for (let i = 0; i <= CANVAS.height / (GRID_CELL_SIZE * scale); i++) {
        CTX.fillRect(0, (i * GRID_CELL_SIZE - gridGapY % (GRID_CELL_SIZE * scale)) * scale, CANVAS.width, GRID_LINE_SIZE * scale);
    }

    // Draw the selected cell if we use the eraser
    if (selectedColor === 8) {
        CTX.strokeRect(selectedCellX, selectedCellY, GRID_CELL_SIZE * scale, GRID_CELL_SIZE * scale);
    }

    //#endregion
}

// Apply blur filter on everything except color-selector, help-box and body
// The parameter active define if the function set the blur active or inactive, boolean
function setBlur(active) {
    if (active) {
        COOR_TEXT.style.filter = "blur(1em)";
        CANVAS.style.filter = "blur(1em)";
        document.querySelector(".right-part").style.filter = "blur(1em)";
        HELP_TEXT.style.filter = "blur(1em)";
    } else {
        COOR_TEXT.style.filter = "none";
        CANVAS.style.filter = "none";
        document.querySelector(".right-part").style.filter = "none";
        HELP_TEXT.style.filter = "none";
    }
}

// Set the color of all the colors box
for (let i = 0; i < colorList.length; i++) {
    document.querySelector(`.color-${i}`).style.backgroundColor = colorList[i];
}

// Define thickness the selected cell of the eraser
CTX.lineWidth = 20;

// Start the loop
setInterval(Update, 1000 / 60);

//#region INPUTS

// Keyboard
// Release
document.addEventListener("keyup", (e) => {
    // Open or close the color selector menu when we release space
    if (e.code === "Space" && !helpOpened && selectedColor !== 8) {
        if (!colorSelectorOpened) {
            document.querySelector(".color-selector").style.display = "block";
            setBlur(true);
        } else {
            document.querySelector(".color-selector").style.display = "none";
            setBlur(false);

            // Set the color of all the colors box
            colorList[selectedColor] = document.querySelector(".color-selector input").value;
            for (let i = 0; i < colorList.length; i++) {
                document.querySelector(`.color-${i}`).style.backgroundColor = colorList[i];
            }
        }
        colorSelectorOpened = !colorSelectorOpened;
    }
})

// Mouse
// Press
CANVAS.addEventListener("mousedown", (e) => {
    // Right-click
    if (e.button === 2) {
        mouseRightDown = true;
    }
})

// Release
CANVAS.addEventListener("mouseup", (e) => {
    // Right-click
    if (e.button === 2) {
        mouseRightDown = false;
    }

    // Create a new cell where we click
    if (e.button === 0 && !colorSelectorOpened && !helpOpened) {
        if (selectedColor === 8) {
            removeCell(Math.floor((selectedCellX / scale + gridGapX) / GRID_CELL_SIZE), Math.floor((selectedCellY / scale + gridGapY) / GRID_CELL_SIZE));
        } else {
            newCell(Math.floor((selectedCellX / scale + gridGapX) / GRID_CELL_SIZE), Math.floor((selectedCellY / scale + gridGapY) / GRID_CELL_SIZE),
                colorList[selectedColor]);
        }
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

// Help box
// Open the help box
HELP_TEXT.addEventListener("click", () => {
    if (!colorSelectorOpened && !helpOpened) {
        helpOpened = true;
        document.querySelector(".help-box").style.display = "block";
        setBlur(true);
    }
});

// Close the help box
document.querySelector(".close-help").addEventListener("click", () => {
    helpOpened = false;
    document.querySelector(".help-box").style.display = "none";
    setBlur(false);
});

//#endregion