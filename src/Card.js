import React, { useState } from 'react';
import './Card.css';

function Card({ cardList, selectedCardIds, setSelectedCardIds }) {
  const [hoveredCard, setHoveredCard] = useState(null);

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
    const definitions = JSON.parse(character.definitions.replace(/'/g, '"'));
    alert(`Definition for character ${character.simplified} (${character.pinyinDiacritic}): ${definitions.join(', ')}`);
  };

  return (
    <div className="card__row">
      {cardList.map((card) => (
        <div
          className={`card ${selectedCardIds.includes(card.id) ? 'card--clicked' : ''}`}
          onClick={() => handleClick(card.id)}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
          key={card.id}
        >
          <span className="card__chinese-character">{card.simplified}</span>
          {hoveredCard === card.id && (
            <button className="def-button" onClick={(e) => { e.stopPropagation(); handleDefClick(card); }}>Def.</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Card;
