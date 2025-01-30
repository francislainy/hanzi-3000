import React, {useEffect, useState} from 'react';
import {doc, getDoc, setDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {db} from "../../firebaseConfig";
import './Card.css';
import Toast from "../Toast/Toast";

function Card({cardList, selectedCardIds: initialSelectedCardIds, setSelectedCardIds: parentSetSelectedCardIds,
                  memorizedCardIds: initialMemorizedCardIds, setMemorizedCardIds: parentSetMemorizedCardIds,
                  score: initialScore, setScore: parentSetScore}) {

    const [hoveredCard, setHoveredCard] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Local state for current session
    const [localSelectedCardIds, setLocalSelectedCardIds] = useState([]);
    const [localMemorizedCardIds, setLocalMemorizedCardIds] = useState([]);
    const [localScore, setLocalScore] = useState(0);

    const auth = getAuth();

    // Reset all states to initial values
    const resetToInitialState = () => {
        setLocalSelectedCardIds([]);
        setLocalMemorizedCardIds([]);
        setLocalScore(0);
        parentSetSelectedCardIds([]);
        parentSetMemorizedCardIds([]);
        parentSetScore(0);
    };

    // Auth state change handler
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            console.log("Auth state changed. Current user:", currentUser?.uid);

            // Always reset states first
            resetToInitialState();

            if (currentUser) {
                // If user is logged in, fetch their data
                try {
                    const userDoc = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(userDoc);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log("Retrieved user data for", currentUser.uid, ":", data);

                        // Update states with user's data
                        setLocalSelectedCardIds(data.selectedCardIds || []);
                        setLocalMemorizedCardIds(data.memorizedCardIds || []);
                        setLocalScore(data.score || 0);
                        parentSetSelectedCardIds(data.selectedCardIds || []);
                        parentSetMemorizedCardIds(data.memorizedCardIds || []);
                        parentSetScore(data.score || 0);
                    } else {
                        // Create new document for first-time users
                        await setDoc(userDoc, {
                            email: currentUser.email,
                            selectedCardIds: [],
                            memorizedCardIds: [],
                            score: 0,
                            createdAt: new Date().toISOString(),
                            lastUpdated: new Date().toISOString()
                        });
                    }
                } catch (error) {
                    console.error("Error loading user data:", error);
                    resetToInitialState(); // Reset on error
                }
            }
            // If user is null (guest), states are already reset

            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Save to Firebase whenever state changes (only for authenticated users)
    useEffect(() => {
        const saveUserData = async () => {
            if (user && !loading) {
                try {
                    const userDoc = doc(db, "users", user.uid);
                    await setDoc(userDoc, {
                        email: user.email,
                        selectedCardIds: localSelectedCardIds,
                        memorizedCardIds: localMemorizedCardIds,
                        score: localScore,
                        lastUpdated: new Date().toISOString()
                    }, {merge: true});
                    console.log("Saved data for user", user.uid, ":", {
                        selectedCardIds: localSelectedCardIds,
                        memorizedCardIds: localMemorizedCardIds,
                        score: localScore
                    });
                } catch (error) {
                    console.error("Error saving user data:", error);
                }
            }
        };

        if (user) {
            saveUserData();
        }
    }, [localSelectedCardIds, localMemorizedCardIds, localScore, user]);

    const handleClick = (cardId) => {
        const isCurrentlySelected = localSelectedCardIds.includes(cardId);

        if (isCurrentlySelected) {
            setLocalSelectedCardIds(prev => prev.filter(id => id !== cardId));
            setLocalScore(prev => Math.max(prev - 1, 0));
            parentSetSelectedCardIds(prev => prev.filter(id => id !== cardId));
            parentSetScore(prev => Math.max(prev - 1, 0));
        } else {
            setLocalSelectedCardIds(prev => [...prev, cardId]);
            setLocalScore(prev => prev + 1);
            parentSetSelectedCardIds(prev => [...prev, cardId]);
            parentSetScore(prev => prev + 1);
        }
    };

    const handleBrainClick = async (cardId) => {
        setLocalMemorizedCardIds(prev => [...prev, cardId]);
        parentSetMemorizedCardIds(prev => [...prev, cardId]);

        if (!localSelectedCardIds.includes(cardId)) {
            setLocalScore(prev => prev + 1);
            parentSetScore(prev => prev + 1);
        }
    };

    const handleDefClick = (character) => {
        let definitions;
        if (Array.isArray(character.definitionsDiacritic)) {
            definitions = character.definitionsDiacritic;
        } else {
            try {
                definitions = JSON.parse(character.definitionsDiacritic.replace(/'/g, '"'));
            } catch (error) {
                console.error('Error parsing definitionsDiacritic:', error);
            }
        }

        setToastMessage(`${character.simplified} (${character.pinyinDiacritic}): ${definitions.join(', ')}`);
        setShowToast(true);
    };

    const handleRevertClick = async () => {
        // Reset all states
        resetToInitialState();

        // If user is authenticated, update Firebase
        if (user) {
            try {
                const userDoc = doc(db, "users", user.uid);
                await setDoc(userDoc, {
                    email: user.email,
                    memorizedCardIds: [],
                    selectedCardIds: [],
                    score: 0,
                    lastUpdated: new Date().toISOString()
                }, {merge: true});
                console.log("Reset data for user:", user.uid);
            } catch (error) {
                console.error("Error resetting user data:", error);
            }
        }
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card__container">
            <div className="card__buttons">
                <button className="revert-button" onClick={handleRevertClick}>Start Again</button>
                <div className="score-display">Score: {localScore}</div>
            </div>
            <div className="card__row">
                {cardList.filter(card => !localMemorizedCardIds.includes(card.id)).map((card) => (
                    <div
                        className={`card ${localSelectedCardIds.includes(card.id) ? 'card--clicked' : ''}`}
                        onClick={() => handleClick(card.id)}
                        onMouseEnter={() => setHoveredCard(card.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        key={card.id}
                    >
                        {showToast && <Toast message={toastMessage}/>}
                        <span className="card__chinese-character">{card.simplified}</span>
                        {hoveredCard === card.id && (
                            <>
                                <button className="def-button" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDefClick(card);
                                }}>Def.
                                </button>
                                <button className="brain-button" onClick={(e) => {
                                    e.stopPropagation();
                                    handleBrainClick(card.id);
                                }}>🧠
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Card;