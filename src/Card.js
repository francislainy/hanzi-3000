import React from 'react';
import './Card.css';

function Card({ cardList, selectedCardIds, setSelectedCardIds }) {
  
  const handleClick = (cardId) => {
    setSelectedCardIds((prevSelectedCardIds) => {
      if (prevSelectedCardIds.includes(cardId)) {
        return prevSelectedCardIds.filter((id) => id !== cardId); // Unselect the card if it's already selected
      } else {
        return [...prevSelectedCardIds, cardId]; // Select the card if it's not selected
      }
    });
  };

  return (
    <div className="card__row">
      {cardList.map((card) => (
        <div
          className={`card ${selectedCardIds.includes(card.id) ? 'card--clicked' : ''}`}
          onClick={() => handleClick(card.id)}
          key={card.id}
        >
          <span className="card__chinese-character">{card.chineseCharacter}</span>
        </div>
      ))}
    </div>
  );
}

export default Card;