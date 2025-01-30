import React from 'react';

import './Logout.css';

function Logout({onLogout, isGuest}) {
    return (
        <div className="logout-container">
            {!isGuest && <button className="logout-button" onClick={onLogout}>Logout</button>}
        </div>
    );
}

export default Logout;
