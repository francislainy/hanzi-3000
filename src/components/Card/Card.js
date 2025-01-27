import React, { useState, useEffect } from 'react';
import './Card.css';
import Toast from "../Toast/Toast";

function Card({ cardList, selectedCardIds, setSelectedCardIds }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [memorizedCardIds, setMemorizedCardIds] = useState([]);

  const handleClick = (cardId) => {
    setSelectedCardIds((prevSelectedCardIds) => {
      if (prevSelectedCardIds.includes(cardId)) {
        return prevSelectedCardIds.filter((id) => id !== cardId); // Unselect the card if it's already selected
      } else {
        return [...prevSelectedCardIds, cardId]; // Select the card if it's not selected
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

  const handleBrainClick = (cardId) => {
    setMemorizedCardIds((prevMemorizedCardIds) => [...prevMemorizedCardIds, cardId]);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
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
  );
}

export default Card;