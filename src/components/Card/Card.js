import React, {useEffect, useState} from 'react';
import {doc, getDoc, setDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {db} from "../../firebaseConfig";
import './Card.css';
import Toast from "../Toast/Toast";

function Card({cardList, selectedCardIds, setSelectedCardIds, memorizedCardIds, setMemorizedCardIds, score, setScore}) {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [user, setUser] = useState(null);

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed. Current user:", currentUser?.uid);
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    // Save selected cards and score to Firebase whenever they change
    useEffect(() => {
        if (user) {
            const userDoc = doc(db, "users", user.uid);
            setDoc(userDoc, {
                selectedCardIds: selectedCardIds,
                memorizedCardIds: memorizedCardIds,
                score: score,
                lastUpdated: new Date().toISOString(),
            }, {merge: true});
        }
    }, [selectedCardIds, memorizedCardIds, user]);

    const handleClick = (cardId) => {
        const isCurrentlySelected = selectedCardIds.includes(cardId);

        if (isCurrentlySelected) {
            // If card is already selected, deselect it and decrease score
            setSelectedCardIds(prev => prev.filter(id => id !== cardId));
            setScore(prev => Math.max(prev - 1, 0));
        } else {
            // If card is not selected, select it and increase score
            setSelectedCardIds(prev => [...prev, cardId]);
            setScore(prev => prev + 1);
        }
    };

    const handleBrainClick = async (cardId) => {
        setMemorizedCardIds((prevMemorizedCardIds) => {
            return [...prevMemorizedCardIds, cardId];
        });

        if (!selectedCardIds.includes(cardId)) {
            setScore((prevScore) => prevScore + 1);
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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user) {
                    console.log("Fetching data for user:", user.uid);
                    const userDoc = doc(db, "users", user.uid);
                    const docSnap = await getDoc(userDoc);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log("Retrieved user data:", data);
                        // Load memorized cards from Firebase
                        setMemorizedCardIds(data.memorizedCardIds || []);
                        // Load selected cards from Firebase
                        if (data.selectedCardIds) {
                            setSelectedCardIds(data.selectedCardIds);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [user]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleRevertClick = async () => {
        try {
            if (user) {
                console.log("Resetting data for user:", user.uid);
                const userDoc = doc(db, "users", user.uid);
                await setDoc(userDoc, {
                    memorizedCardIds: [],
                    selectedCardIds: [],
                    score: 0,
                    email: user.email,
                    lastUpdated: new Date().toISOString()
                }, {merge: true});
                console.log("Successfully reset user data");
            }
            setMemorizedCardIds([]);
            setSelectedCardIds([]);
            setScore(0)
        } catch (error) {
            console.error("Error resetting user data:", error);
        }
    };

    return (
        <div className="card__container">
            <div className="card__buttons">
                <button className="revert-button" onClick={handleRevertClick}>Start Again</button>
                <div className="score-display">Score: {score}</div>
            </div>
            <div className="card__row">
                {cardList.filter(card => !memorizedCardIds.includes(card.id)).map((card) => (
                    <div
                        className={`card ${selectedCardIds.includes(card.id) ? 'card--clicked' : ''}`}
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