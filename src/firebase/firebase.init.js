// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJCd4S4x1DzgWCjJnYtJsDy4vWrfkUGWg",
  authDomain: "tech-trek-client.firebaseapp.com",
  projectId: "tech-trek-client",
  storageBucket: "tech-trek-client.firebasestorage.app",
  messagingSenderId: "98914316126",
  appId: "1:98914316126:web:06eb63d5da0bc60da429cf"
};

// console.log("API Key:", import.meta.env.VITE_API_KEY);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
