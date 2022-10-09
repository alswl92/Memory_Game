import React from 'react'

function Box({id,onClick,blink}){
    return(
        <div onClick={onClick} className ={`box${id} ${blink ? "blink" : ""}`}></div>
    )
}

export default Box