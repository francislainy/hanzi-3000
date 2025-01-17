// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCobhjZZs6XfvRYUMvq56vT50mjYoF7iJk",
    authDomain: "mandarin-flashcards-139d3.firebaseapp.com",
    projectId: "mandarin-flashcards-139d3",
    storageBucket: "mandarin-flashcards-139d3.appspot.com",
    messagingSenderId: "582175360511",
    appId: "1:582175360511:web:d66e71a83fec59a5ca53ca",
    measurementId: "G-734738NMZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;