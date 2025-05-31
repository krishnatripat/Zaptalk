import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDXYy1qI5zeEU6FHTB-eJNvbnkZqEjcJQg",
  authDomain: "whatsapp-clone-ea6a5.firebaseapp.com",
  projectId: "whatsapp-clone-ea6a5",
  storageBucket: "whatsapp-clone-ea6a5.appspot.com", // ✅ fixed
  messagingSenderId: "636901680689",
  appId: "1:636901680689:web:19adc8e9ec75cf37f81710",
  measurementId: "G-VS4EXQ3SJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Only initialize analytics in the browser
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

// ✅ Export the Auth object for use in your app
export const firebaseAuth = getAuth(app);
