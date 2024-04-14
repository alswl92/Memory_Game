import React, {useState} from 'react';
import Game from './components/Game'
import Home from './components/Home'

function App() {

  const handleChangeStatusGame = (status) => {
    setStatusGame(status);
  }
  const [statusGame, setStatusGame] = useState(null);
  let layout;
  switch(statusGame){
    case 'playGame':
      layout = <Game onClose={handleChangeStatusGame}/>
      break;
    default:
      layout = <Home onGame={handleChangeStatusGame} />
      break;
  }

  return (
    <>
      { layout }
    </>
  );
}
export default App;
