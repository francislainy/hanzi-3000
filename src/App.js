import './App.css';
import Card from './Card';
import Banner from './Banner';
import { useState } from 'react';

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
  const [bannerButtonText, setBannerButtonText] = useState(GAME_STATES.start.bannerButtonText )
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  const cardList = [
    { id: 1, chineseCharacter: '中' },
    { id: 2, chineseCharacter: '国' },
    { id: 3, chineseCharacter: '字' },
    { id: 4, chineseCharacter: '测' },
  ];

  const handleStartGame = () => {
    setHasGameStarted(true)
    setBannerDescription(GAME_STATES.playing.bannerDescription)
    setBannerButtonText(GAME_STATES.playing.bannerButtonText)
  }

  const handleSeeResults = () => {
    setBannerDescription(`You have selected ${selectedCardIds.length} out of ${cardList.length} cards.`)
    setBannerButtonText(GAME_STATES.results.bannerButtonText)
  }

  const handleStartAgain = () => {
    setHasGameStarted(true)
    setBannerDescription(GAME_STATES.playing.bannerDescription)
    setBannerButtonText(GAME_STATES.playing.bannerButtonText)
    setSelectedCardIds([])
  }

  return (
    <div className="app">
      <Banner
        title={bannerTitle}
        description={bannerDescription}
        buttonText={bannerButtonText}
        handleStartGame={bannerButtonText === "Start Again" ? handleStartAgain : (hasGameStarted ? handleSeeResults : handleStartGame)}
      />
      {hasGameStarted && <Card
        selectedCardIds={selectedCardIds}
        setSelectedCardIds={setSelectedCardIds}
        cardList={cardList} />}
    </div>
  );
}

export default App;
