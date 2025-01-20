import React, { useState } from 'react';
import './App.css';
import characterList from '../../characterList.json';
import Authentication from './Authentication';
import Logout from './Logout';
import TestBanner from './TestBanner';
import TestContent from './TestContent';
import Footer from './Footer';
import { signInWithGoogle, signOutFromGoogle } from "../AuthService";
import { getAuth } from "firebase/auth";
import app from '../../firebaseConfig';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [hasTestStarted, setHasTestStarted] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("Chinese Character Test");
  const [bannerDescription, setBannerDescription] = useState(
      'Test your knowledge of Chinese characters in this fun and interactive game. Click the button below to start the test.'
  );
  const [bannerButtonText, setBannerButtonText] = useState("Start Test");
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const CARDS_PER_PAGE = 150;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastCard = currentPage * CARDS_PER_PAGE;
  const indexOfFirstCard = indexOfLastCard - CARDS_PER_PAGE;
  const currentCards = characterList.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(characterList.length / CARDS_PER_PAGE);

  const handleLoginWithGoogle = async () => {
    try {
      await signInWithGoogle();
      setIsUserLoggedIn(true);
      setIsGuest(false);
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await auth.signOut();
      setIsUserLoggedIn(false);
      setIsGuest(false);
    } catch (error) {
      console.error("Error logging out from Google", error);
    }
  };

  const handleContinueAsGuest = () => {
    setIsUserLoggedIn(true);
    setIsGuest(true);
  };

  const handleStartTest = () => {
    setHasTestStarted(true);
    setBannerDescription(
        "Click on the characters you know. Once you're done, click the button below to see your total."
    );
    setBannerButtonText("See Results");
  };

  const handleSeeResults = () => {
    setBannerDescription(
        `You know ${selectedCardIds.length} out of ${characterList.length} characters.`
    );
    setBannerButtonText("Start Again");
    setHasTestStarted(false);
  };

  const handleStartAgain = () => {
    setHasTestStarted(true);
    setBannerDescription(
        "Click on the characters you know. Once you're done, click the button below to see your total."
    );
    setBannerButtonText("See Results");
    setSelectedCardIds([]);
    setCurrentPage(1);
  };

  const handleBannerButtonClick = bannerButtonText === "Start Again"
      ? handleStartAgain
      : hasTestStarted
          ? handleSeeResults
          : handleStartTest;

  return (
      <div className={hasTestStarted ? "app app__testStarted" : "app"}>
        {!isUserLoggedIn ? (
            <Authentication
                onLoginWithGoogle={handleLoginWithGoogle}
                onContinueAsGuest={handleContinueAsGuest}
            />
        ) : (
            <>
              <Logout onLogout={handleLogout} isGuest={isGuest} />
              <TestBanner
                  bannerTitle={bannerTitle}
                  bannerDescription={bannerDescription}
                  bannerButtonText={bannerButtonText}
                  onButtonClick={handleBannerButtonClick}
              />
              <TestContent
                  hasTestStarted={hasTestStarted}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  currentCards={currentCards}
                  selectedCardIds={selectedCardIds}
                  setSelectedCardIds={setSelectedCardIds}
              />
              {!hasTestStarted && <Footer />}
            </>
        )}
      </div>
  );
}

export default App;
