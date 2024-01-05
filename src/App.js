import './App.css';
import Card from './Card';

function App() {
  return (
    <div className="app">
      <h1 className='app__title'>Chinese Character Test</h1>
      <p className='app__description'>Test your knowledge of Chinese characters in this fun and interactive game. Click the button below to start the game.</p>
      <button className='app__start-button'>Start Game</button>
      <Card />
    </div>
  );
}

export default App;
