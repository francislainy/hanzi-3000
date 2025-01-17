// Import Firebase Auth and Google Provider
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from '../firebaseConfig'; // Adjust the import path as necessary


// Initialize Firebase Auth and Google Auth Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Define the Sign-In Function
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        // Access token, user info, etc.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        // Use token and user info as needed
    } catch (error) {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        // Error details
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // Handle or log error information
    }
};

// Export the Sign-In Function
export { signInWithGoogle };