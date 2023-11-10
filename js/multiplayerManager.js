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
