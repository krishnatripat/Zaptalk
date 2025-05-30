import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAmfWtB8Udq0_GAQ1R6xVBwmDUH5ALOruk",
    authDomain:"https://zaptalk-tikz.onrender.com",
    projectId: "Whatsapp-5bf1e",
    storageBucket: "Whatsapp-5bf1e.firebasestorage.app",
    messagingSenderId: "856779991490",
    appId: "1:856779991490:web:4b9adb28ec11c70c684e5b",
    measurementId: "G-X0J04EL5QQ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const Auth = getAuth(app);
export const firebaseAuth = getAuth(app);
