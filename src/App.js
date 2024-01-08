import './App.css';
import Card from './Card';
import Banner from './Banner';
import { useState } from 'react';
import Pagination from './Pagination';
import cardList from './cardList.json';

function App() {

  const GAME_STATES = {
    'start': {
      bannerDescription: 'Test your knowledge of Chinese characters in this fun and interactive game. Click the button below to start the game.',
      bannerButtonText: 'Start Game',
      bannerTitle: 'Chinese Character Test',
    },
    'playing': {
      bannerDescription: "Click on the characters you know. Once you're done, click the button below to see your total.",
      bannerButtonText: 'See Results',
    },
    'results': {
      bannerDescription: '', // This will be updated dynamically based on selected cards
      bannerButtonText: 'Start Again',
    },
  };

  const [hasGameStarted, setHasGameStarted] = useState(false)
  const [bannerTitle, setBannerTitle] = useState(GAME_STATES.start.bannerTitle)
  const [bannerDescription, setBannerDescription] = useState(GAME_STATES.start.bannerDescription)
  const [bannerButtonText, setBannerButtonText] = useState(GAME_STATES.start.bannerButtonText)
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  const CARDS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastCard = currentPage * CARDS_PER_PAGE;
  const indexOfFirstCard = indexOfLastCard - CARDS_PER_PAGE;
  const currentCards = cardList.slice(indexOfFirstCard, indexOfLastCard);

  const handleStartGame = () => {
    setHasGameStarted(true)
    setBannerDescription(GAME_STATES.playing.bannerDescription)
    setBannerButtonText(GAME_STATES.playing.bannerButtonText)
  }

  const handleSeeResults = () => {
    setBannerDescription(`You know ${selectedCardIds.length} out of ${cardList.length} characters.`)
    setBannerButtonText(GAME_STATES.results.bannerButtonText)
    setHasGameStarted(false)
  }

  const handleStartAgain = () => {
    setHasGameStarted(true)
    setBannerDescription(GAME_STATES.playing.bannerDescription)
    setBannerButtonText(GAME_STATES.playing.bannerButtonText)
    setSelectedCardIds([])
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(cardList.length / CARDS_PER_PAGE);

  return (
    <div className="app">
      <Banner
        title={bannerTitle}
        description={bannerDescription}
        buttonText={bannerButtonText}
        handleStartGame={bannerButtonText === "Start Again" ? handleStartAgain : (hasGameStarted ? handleSeeResults : handleStartGame)}
      />
      {hasGameStarted && <>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} />
        <Card
          selectedCardIds={selectedCardIds}
          setSelectedCardIds={setSelectedCardIds}
          cardList={currentCards} />
      </>
      }
    </div>
  );
}

export default App;
