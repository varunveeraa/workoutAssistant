// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh8YCLdRJ2tpdtaZmxaPoHtuelBoOZjeY",
  authDomain: "workoutassist-eb87c.firebaseapp.com",
  projectId: "workoutassist-eb87c",
  storageBucket: "workoutassist-eb87c.appspot.com",
  messagingSenderId: "529418258804",
  appId: "1:529418258804:web:0e05c2a6eba2fe14bf8421",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
