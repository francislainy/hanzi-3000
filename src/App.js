import './App.css';
import Card from './Card';
import Banner from './Banner';
import { useState } from 'react';

function App() {
  const [hasGameStarted, setHasGameStarted] = useState(false)
  const [bannerTitle, setBannerTitle] = useState('Chinese Character Test')
  const [bannerDescriotion, setBannerDescription] = useState('Test your knowledge of Chinese characters in this fun and interactive game. Click the button below to start the game.')
  const [bannerButtonText, setBannerButtonText] = useState('Start Game')


  const handleStartGame = () => {
    setHasGameStarted(true)
    setBannerDescription("Click on the characters you know. Once you're done, click the button below to see your total.")
    setBannerButtonText("See Results")
  }

  return (
    <div className="app">
      <Banner
        title={bannerTitle}
        description={bannerDescriotion}
        buttonText={bannerButtonText} handleStartGame={handleStartGame}
      />
      {hasGameStarted && <Card />}
    </div>
  );
}

export default App;
