"use strict";

// Select the color in parameters
function selectColor(colorId) {
    document.querySelector(".selectedColor").classList.remove("selectedColor");
    document.querySelector(`.color-${colorId}`).classList.add("selectedColor");
}