import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import app from '../firebaseConfig'; // Adjust the import path as necessary

const auth = getAuth(app);

const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: "select_account", // Ensures account selection every time
    });
    return await signInWithPopup(auth, provider);
};

const signOutFromGoogle = async () => {
    try {
        await signOut(auth);
        console.log('User signed out successfully');
    } catch (error) {
        console.error('Error during sign-out:', error);
    }
};

export { signInWithGoogle, signOutFromGoogle };

