import React, {useState, useEffect} from 'react';
import Box from './components/Box'
import timeout from './components/timeout'

function App() {
  const [isOn, setIsOn] = useState(false);
  const [startButton,setStartButton] = useState(false);
  const [gameoverDiv, setGameoverDiv] = useState(false);
  const [scoreDiv,setScoreDiv] = useState(true);
  const patternList = ['1','2','3','4','5'];
  const initPlay = {
    pattern: [],
    score: 0,
    userPlay: false,
    userGuess: [],
  };
  const [play,setPlay] = useState(initPlay);
  const [blink, setBlink] = useState('');

  function startClicked() {
    setIsOn(true);
    setStartButton(true);
    setScoreDiv(false);
  }

  useEffect(() => {
    if(isOn){
      let newPattern = patternList[Math.floor(Math.random()*5)]
      const copypattern = [... play.pattern];
      copypattern.push(newPattern);
      setPlay({...play, pattern: copypattern});
    }
  }, [isOn]);

  useEffect(()=>{
    if (isOn && play.pattern.length){
      displayPattern();
    }
  },[isOn, play.pattern.length])

  async function displayPattern(){
    await timeout(500);
    for (let i =0 ; i < play.pattern.length; i++){
      setBlink(play.pattern[i]);
      await timeout(500);
      setBlink('');
      await timeout(500);

      if (i === play.pattern.length -1){
        const copypattern = [...play.pattern];
        setPlay({...play, userPlay: true, userGuess: copypattern.reverse()});
        setIsOn(false);
      }
    }
  }

  async function boxClick(id){
    if (!isOn && play.userPlay){
      const copyUserGuess = [...play.userGuess];
      const lastId = copyUserGuess.pop();
      setBlink(id);

      if (id === lastId){  //if it's the right pattern
        if(copyUserGuess.length){ //if there is remaining
          setPlay({...play, userGuess: copyUserGuess}); //one less color
        }
        else{ //if this is the last color, we want to move to the next level
          await timeout(200);
          setPlay({...play, userPlay:false, score:play.pattern.length, userGuess:[],}); //keeping the system pattern but emptying the guess
          setIsOn(true);
        }
      }else{ //if fails
        await timeout(200);
        setPlay({...initPlay, score:play.pattern.length});
        setIsOn(false);
        setGameoverDiv(true);
      }
      await timeout(200); //resets
      setBlink('');
    }
  }

  function closeClicked(){
    setGameoverDiv(false);
    setStartButton(false);
  }

  return (
    <div className="App">
      <h1 className="title">Memorize the Pattern!</h1>
      <div className='score' hidden ={scoreDiv}>Level: {play.score +1}</div>
      <button className = 'btn' onClick={startClicked} hidden = {startButton}>Start Game</button>
      <div className="app_container">
        {patternList && patternList.map((v,i) => 
        <Box key = {v} id ={v} blink = {blink ===v} onClick = {() => boxClick(v)}></Box>)}
        {gameoverDiv && (
          <div className = 'gameover' hidden= {gameoverDiv}>
            <div>Final Score: {play.score}</div>
            <button className='btn' onClick={closeClicked}>Close</button>
          </div>
      )}
     
      </div>
    </div>
  );
}
export default App;
