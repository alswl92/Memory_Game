import React, {useState, useEffect} from 'react';
import Box from './Box'
import timeout from './timeout'

function Game({ onClose }) {
  const [isOn, setIsOn] = useState(false);
  const [startButton,setStartButton] = useState(false);
  const [challengeOn,setChallengeOn] = useState(true);
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
    setChallengeOn(true);
  }

  useEffect(() => {
    if(isOn){
      let newPattern = patternList[Math.floor(Math.random()*5)];
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
      setChallengeOn(true);
      await timeout(500);
      setBlink('');
      await timeout(500);

      if (i === play.pattern.length -1){
        const copypattern = [...play.pattern];
        setPlay({...play, userPlay: true, userGuess: copypattern.reverse()});
        setIsOn(false);
        setChallengeOn(false);
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
      setChallengeOn(false);
      setBlink('');
    }
  }

  function closeClicked(){
   onClose(null);
  }


  return (
   <div className="game">
      <div className='game_container'>
         <div className='instruction'>
            <div className='score' hidden ={scoreDiv}>Level: {play.score +1}</div>
            <div className='instruction_txt' hidden ={!startButton}>{challengeOn ? 'Memorize NOW' : 'Guessing Time!'}</div>
            <button className = 'btn' onClick={startClicked} hidden = {startButton}> Click If You Are Ready</button>
         </div>
         <div className="box_container">
            {patternList && patternList.map((v,i) => 
            <Box key = {v} id ={v} blink = {blink ===v} onClick = {() => boxClick(v)}></Box>)}
         </div>
      </div>
      {gameoverDiv && (
               <div className = 'gameover' hidden= {gameoverDiv}>
               <div className='gameover_txt'>Final Score: {play.score}</div>
               <button className='btn' onClick={closeClicked}>Close</button>
               </div>
            )}
   </div>
  );
}
export default Game;