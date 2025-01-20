import React from 'react';

function Authentication({ onLoginWithGoogle, onContinueAsGuest }) {
    return (
        <div className="button-container">
            <button onClick={onLoginWithGoogle}>Login with Google</button>
            <button onClick={onContinueAsGuest}>Continue as Guest</button>
        </div>
    );
}

export default Authentication;
