import React from 'react'

const Home = ({onGame}) =>{
   return (
      <div className = "home">
         <h1>Memory Game </h1>
         <button className='btn' onClick={() => onGame('playGame')}>Start</button>
      </div>
   )
}

export default Home