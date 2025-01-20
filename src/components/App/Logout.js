import React from 'react';

function Logout({ onLogout, isGuest }) {
    return (
        <div className="button-container">
            {!isGuest && <button onClick={onLogout}>Logout</button>}
        </div>
    );
}

export default Logout;
