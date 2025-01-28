import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebaseConfig";
import './Card.css';
import Toast from "../Toast/Toast";

function Card({ cardList, selectedCardIds, setSelectedCardIds }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [memorizedCardIds, setMemorizedCardIds] = useState([]);
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed. Current user:", currentUser?.uid);
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = (cardId) => {
    setSelectedCardIds((prevSelectedCardIds) => {
      if (prevSelectedCardIds.includes(cardId)) {
        return prevSelectedCardIds.filter((id) => id !== cardId);
      } else {
        return [...prevSelectedCardIds, cardId];
      }
    });
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

  const handleBrainClick = async (cardId) => {
    setMemorizedCardIds((prevMemorizedCardIds) => {
      const updatedMemorizedCardIds = [...prevMemorizedCardIds, cardId];
      saveMemorizedCardIds(updatedMemorizedCardIds);
      return updatedMemorizedCardIds;
    });

    // Update selectedCardIds state
    setSelectedCardIds((prevSelectedCardIds) => {
      if (prevSelectedCardIds.includes(cardId)) {
        return prevSelectedCardIds.filter((id) => id !== cardId);
      } else {
        return [...prevSelectedCardIds, cardId];
      }
    });
  };

  const saveMemorizedCardIds = async (memorizedCardIds) => {
    try {
      if (user) {
        console.log("Saving for user:", user.uid);
        const userDoc = doc(db, "users", user.uid);
        await setDoc(userDoc, {
          memorizedCardIds: memorizedCardIds,
          email: user.email,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log("Successfully saved memorized cards:", memorizedCardIds);
      }
    } catch (error) {
      console.error("Error saving memorized card IDs:", error);
    }
  };

  useEffect(() => {
    const fetchMemorizedCardIds = async () => {
      try {
        if (user) {
          console.log("Fetching for user:", user.uid);
          const userDoc = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Retrieved data:", data);
            setMemorizedCardIds(data.memorizedCardIds || []);
          } else {
            console.log("No document exists, creating new one");
            await setDoc(userDoc, {
              memorizedCardIds: [],
              email: user.email,
              lastUpdated: new Date().toISOString()
            }, { merge: true });
            setMemorizedCardIds([]);
          }
        }
      } catch (error) {
        console.error("Error fetching memorized card IDs:", error);
      }
    };

    fetchMemorizedCardIds();
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
        console.log("Resetting memorized cards for user:", user.uid);
        const userDoc = doc(db, "users", user.uid);
        await setDoc(userDoc, {
          memorizedCardIds: [],
          email: user.email,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log("Successfully reset memorized cards.");
        setMemorizedCardIds([]);
        setSelectedCardIds([]); // Reset the selected cards locally
      }
    } catch (error) {
      console.error("Error resetting memorized card IDs:", error);
    }
  };

  return (
      <div className="card__container">
        <div className="card__buttons">
          <button className="revert-button" onClick={handleRevertClick}>Revert to Full List</button>
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
                {showToast && <Toast message={toastMessage} />}
                <span className="card__chinese-character">{card.simplified}</span>
                {hoveredCard === card.id && (
                    <>
                      <button className="def-button" onClick={(e) => { e.stopPropagation(); handleDefClick(card); }}>Def.</button>
                      <button className="brain-button" onClick={(e) => { e.stopPropagation(); handleBrainClick(card.id); }}>🧠</button>
                    </>
                )}
              </div>
          ))}
        </div>
      </div>
  );
}

export default Card;