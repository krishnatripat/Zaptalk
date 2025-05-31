// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXYy1qI5zeEU6FHTB-eJNvbnkZqEjcJQg",
  authDomain: "whatsapp-clone-ea6a5.firebaseapp.com",
  projectId: "whatsapp-clone-ea6a5",
  storageBucket: "whatsapp-clone-ea6a5.firebasestorage.app",
  messagingSenderId: "636901680689",
  appId: "1:636901680689:web:19adc8e9ec75cf37f81710",
  measurementId: "G-VS4EXQ3SJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
