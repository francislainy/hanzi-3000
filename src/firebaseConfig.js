import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCobhjZZs6XfvRYUMvq56vT50mjYoF7iJk",
    authDomain: "mandarin-flashcards-139d3.firebaseapp.com",
    projectId: "mandarin-flashcards-139d3",
    storageBucket: "mandarin-flashcards-139d3.appspot.com",
    messagingSenderId: "582175360511",
    appId: "1:582175360511:web:d66e71a83fec59a5ca53ca",
    measurementId: "G-734738NMZF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
export default app;