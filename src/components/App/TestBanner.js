import React from 'react';
import Banner from "../Banner/Banner";

function TestBanner({ bannerTitle, bannerDescription, bannerButtonText, onButtonClick }) {
    return (
        <Banner
            title={bannerTitle}
            description={bannerDescription}
            buttonText={bannerButtonText}
            handleStartTest={onButtonClick}
        />
    );
}

export default TestBanner;
