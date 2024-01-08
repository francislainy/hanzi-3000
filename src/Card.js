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

  const handleDefClick = (chineseCharacter) => {
    const url = new URL('https://chinese-english-dictionary-api.p.rapidapi.com/definition');
    url.search = new URLSearchParams({ simplified: chineseCharacter, exact: true });
  
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'dca7d0520dmshbffb5c1b0b6b9e1p1a0763jsn1204add21968',
        'X-RapidAPI-Host': 'chinese-english-dictionary-api.p.rapidapi.com'
      }
    })
    .then(response => response.json())
    .then(data => {
      const definitions = data.entries.flatMap(entry => entry.definitions);
      alert(`Definition of card ${chineseCharacter}: ${definitions.join(', ')}`);
    })
    .catch(error => console.error('Error:', error));
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
          <span className="card__chinese-character">{card.chineseCharacter}</span>
          {hoveredCard === card.id && (
            <button className="def-button" onClick={(e) => { e.stopPropagation(); handleDefClick(card.chineseCharacter); }}>Def.</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Card;
