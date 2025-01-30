import React from 'react';
import Banner from "../Banner/Banner";

function TestBanner({ bannerTitle, bannerDescription, bannerButtonText, onButtonClick, isGuest, onBackToLogin }) {
    return (
        <Banner
            title={bannerTitle}
            description={bannerDescription}
            buttonText={bannerButtonText}
            handleStartTest={onButtonClick}
            isGuest={isGuest}
            onBackToLogin={onBackToLogin}
        />
    );
}

export default TestBanner;

