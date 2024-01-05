import React from 'react';
import './Card.css';

function card() {
  return (
    <div className="card__row">
        <div className="card">
          <span className="card__chinese-character">中</span>
        </div>
        <div className="card">
          <span className="card__chinese-character">国</span>
        </div>
        <div className="card">
          <span className="card__chinese-character">字</span>
        </div>
        <div className="card">
          <span className="card__chinese-character">测</span>
        </div>
      </div>
  )
}

export default card;