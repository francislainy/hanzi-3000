import React, { useState } from 'react';
import './Card.css';

function Card() {
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  const handleClick = (cardId) => {
    setSelectedCardIds((prevSelectedCardIds) => {
      if (prevSelectedCardIds.includes(cardId)) {
        return prevSelectedCardIds.filter((id) => id !== cardId); // Unselect the card if it's already selected
      } else {
        return [...prevSelectedCardIds, cardId]; // Select the card if it's not selected
      }
    });
  };

  const cardList = [
    { id: 1, chineseCharacter: '中' },
    { id: 2, chineseCharacter: '国' },
    { id: 3, chineseCharacter: '字' },
    { id: 4, chineseCharacter: '测' },
  ];

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