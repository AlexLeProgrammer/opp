//#region FIREBASE_CONFIG

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbGys8noxlnXrGn89z1ZPJsatHFKtXjEY",
    authDomain: "online-painting-project.firebaseapp.com",
    projectId: "online-painting-project",
    storageBucket: "online-painting-project.appspot.com",
    messagingSenderId: "952067345337",
    appId: "1:952067345337:web:6ef7d5c03716cd5ab08468",
    databaseURL: "https://online-painting-project-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

//#endregion

/* Insert test data
set(ref(database, "test/"), {
    testString: "hello",
    testNumber: 1234
});

// Read test data
onValue(ref(database, "test/"), (snapshot) => {
    const data = snapshot.val();
    console.log(data);
});*/

// Class
class Cell {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

// Map
let map = [];

// Create a new cell in the map
function newCell(x, y, color) {
    map.push(new Cell(x, y, color));
    set(ref(database), {
        map: map
    });
}

// Returns the index of the cell located at the coordinates in parameters
// If there isn't any cell, return -1
function getCellIndex(x, y) {
    for (let i = 0; i < map.length; i++) {
        if (map[i].x === x && map[i].y === y) {
            return i;
        }
    }
    return -1;
}

// Return the map
function getLocalMap() {
    return map;
}

export { newCell, getCellIndex, getLocalMap }

// Update the local map if the map changed on the server
onValue(ref(database), (data) => {
    map = data.val().map;
});
