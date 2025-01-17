import './App.css';
import { useState } from 'react';
import characterList from '../../characterList.json';
import Banner from "../Banner/Banner";
import Card from "../Card/Card";
import Pagination from '../Pagination/Pagination';
import {signInWithGoogle} from "../AuthService";

function App() {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false); // New state for guest access

  // Function to handle login with Google
  const handleLoginWithGoogle = async () => {
    try {
      await signInWithGoogle();
      setIsUserLoggedIn(true);
      setIsGuest(false); // Ensure guest state is reset
      // Additional logic after successful login
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  // Function to continue as a guest
  const handleContinueAsGuest = () => {
    setIsUserLoggedIn(true); // Treat guest as logged in
    setIsGuest(true);
    // Logic to handle guest access
  };

  const TEST_STATES = {
    'start': {
      bannerDescription: 'Test your knowledge of Chinese characters in this fun and interactive game. Click the button below to start the test.',
      bannerButtonText: 'Start Test',
      bannerTitle: 'Chinese Character Test',
    },
    'inProgress': {
      bannerDescription: "Click on the characters you know. Once you're done, click the button below to see your total.",
      bannerButtonText: 'See Results',
    },
    'results': {
      bannerDescription: '', // This will be updated dynamically based on selected cards
      bannerButtonText: 'Start Again',
    },
  };

  const [hasTestStarted, setHasTestStarted] = useState(false);
  const [bannerTitle, setBannerTitle] = useState(TEST_STATES.start.bannerTitle);
  const [bannerDescription, setBannerDescription] = useState(TEST_STATES.start.bannerDescription);
  const [bannerButtonText, setBannerButtonText] = useState(TEST_STATES.start.bannerButtonText);
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  const CARDS_PER_PAGE = 150;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastCard = currentPage * CARDS_PER_PAGE;
  const indexOfFirstCard = indexOfLastCard - CARDS_PER_PAGE;
  const currentCards = characterList.slice(indexOfFirstCard, indexOfLastCard);

  const handleStartTest = () => {
    setHasTestStarted(true);
    setBannerDescription(TEST_STATES.inProgress.bannerDescription);
    setBannerButtonText(TEST_STATES.inProgress.bannerButtonText);
  };

  const handleSeeResults = () => {
    setBannerDescription(`You know ${selectedCardIds.length} out of ${characterList.length} characters.`);
    setBannerButtonText(TEST_STATES.results.bannerButtonText);
    setHasTestStarted(false);
  };

  const handleStartAgain = () => {
    setHasTestStarted(true);
    setBannerDescription(TEST_STATES.inProgress.bannerDescription);
    setBannerButtonText(TEST_STATES.inProgress.bannerButtonText);
    setSelectedCardIds([]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(characterList.length / CARDS_PER_PAGE);

  // Modify the return statement to include login options if not logged in
  return (
      <div className={hasTestStarted ? "app app__testStarted" : "app"}>
        {!isUserLoggedIn ? (
            <div className="button-container">
              <button onClick={handleLoginWithGoogle}>Login with Google</button>
              <button onClick={handleContinueAsGuest}>Continue as Guest</button>
            </div>
        ) : (
            <>
              <Banner
                  title={bannerTitle}
                  description={bannerDescription}
                  buttonText={bannerButtonText}
                  handleStartTest={bannerButtonText === "Start Again" ? handleStartAgain : (hasTestStarted ? handleSeeResults : handleStartTest)}
              />
              {hasTestStarted && (
                  <>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                    <Card
                        selectedCardIds={selectedCardIds}
                        setSelectedCardIds={setSelectedCardIds}
                        cardList={currentCards}
                    />
                  </>
              )}
              {!hasTestStarted && (
                  <footer className="app__footer">
                    Made with &hearts; by <a href="https://www.linkedin.com/in/francislainycampos/" target="_blank" rel="noopener noreferrer">Francislainy Campos</a>
                  </footer>
              )}
            </>
        )}
      </div>
  );
}

export default App;
