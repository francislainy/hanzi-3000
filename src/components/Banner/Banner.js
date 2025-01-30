import React from "react";
import "./Banner.css";

function Banner({ title, description, buttonText, handleStartTest, isGuest, onBackToLogin }) {
    return (
        <div className="banner">
            <h1 className="banner__title">{title}</h1>
            <p className="banner__description">{description}</p>
            <div className="banner__buttons">
                {isGuest && (
                    <button className="banner__back-button" onClick={onBackToLogin}>
                        Back to Login
                    </button>
                )}
                <button className="banner__start-button" onClick={handleStartTest}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

export default Banner;
