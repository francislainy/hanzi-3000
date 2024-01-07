import './App.css';
import Card from './Card';
import Banner from './Banner';
import { createContext, useState } from 'react';

export const GameContext = createContext();

// App.js
function App() {
  const [hasGameStarted, setHasGameStarted] = useState(false)
  const [bannerTitle, setBannerTitle] = useState('Chinese Character Test')
  const [bannerDescription, setBannerDescription] = useState('Test your knowledge of Chinese characters in this fun and interactive game. Click the button below to start the game.')
  const [bannerButtonText, setBannerButtonText] = useState('Start Game')
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  const cardList = [
    { id: 1, chineseCharacter: '中' },
    { id: 2, chineseCharacter: '国' },
    { id: 3, chineseCharacter: '字' },
    { id: 4, chineseCharacter: '测' },
  ];

  const handleStartGame = () => {
    setHasGameStarted(true)
    setBannerDescription("Click on the characters you know. Once you're done, click the button below to see your total.")
    setBannerButtonText("See Results")
  }

  const handleSeeResults = () => {
    setBannerDescription(`You have selected ${selectedCardIds.length} out of ${cardList.length} cards.`)
    setBannerButtonText("Start Again")
  }

  const handleStartAgain = () => {
    setHasGameStarted(true)
    setBannerDescription('Test your knowledge of Chinese characters in this fun and interactive game. Click the button below to start the game.')
    setBannerButtonText("See Results")
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
