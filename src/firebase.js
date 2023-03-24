/** Porción de código generado para usar mi app firebase de OAuth */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// ---
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4HjyrgTwTd7qwzV9j2-CZg4oTWXWAFqY",
  authDomain: "reactjs-mathplay.firebaseapp.com",
  databaseURL: "https://reactjs-mathplay-default-rtdb.firebaseio.com",
  projectId: "reactjs-mathplay",
  storageBucket: "reactjs-mathplay.appspot.com",
  messagingSenderId: "513048091703",
  appId: "1:513048091703:web:55a92f58d4b53011a3b3b2",
  measurementId: "G-CGQ4NYBS9R"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// -- variable auth para la autenticación de usuarios con firebase autentication
export const auth = getAuth(app);
// -- variable db para la base de datos con firebase realtime database
export const db = getDatabase(app);