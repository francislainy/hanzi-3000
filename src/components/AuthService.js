import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';

const auth = getAuth();

const createInitialUserDocument = async (user) => {
    const userRef = doc(db, "users", user.uid);

    // Check if the document already exists
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        // Create initial user document with default values
        await setDoc(userRef, {
            email: user.email,
            selectedCardIds: [],
            memorizedCardIds: [],
            score: 0,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        });
    }
};

const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account"
        });

        const result = await signInWithPopup(auth, provider);
        // Create or verify user document after successful sign-in
        await createInitialUserDocument(result.user);

        return result;
    } catch (error) {
        console.error('Error during sign-in:', error);
        throw error;
    }
};

const signOutFromGoogle = async () => {
    try {
        await signOut(auth);
        console.log('User signed out successfully');
    } catch (error) {
        console.error('Error during sign-out:', error);
        throw error;
    }
};

export { signInWithGoogle, signOutFromGoogle };