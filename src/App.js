import './App.css';
import Card from './Card';
import Banner from './Banner';

function App() {
  return (
    <div className="app">
      <Banner
        title={'Chinese Character Test'}
        description={'Test your knowledge of Chinese characters in this fun and interactive game. Click the button below to start the game.'}
        buttonText={'Start Game'}
      />
      <Card />
    </div>
  );
}

export default App;
