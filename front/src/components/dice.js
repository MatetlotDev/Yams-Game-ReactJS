/* 
 * Matthias Lechien
 *
 * last Update 26-11-21
 * 
 */

import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //import font awesome 

import { faDiceOne } from '@fortawesome/free-solid-svg-icons'; // import the icons for the dice
import { faDiceTwo } from '@fortawesome/free-solid-svg-icons';
import { faDiceThree } from '@fortawesome/free-solid-svg-icons';
import { faDiceFour } from '@fortawesome/free-solid-svg-icons';
import { faDiceFive } from '@fortawesome/free-solid-svg-icons';
import { faDiceSix } from '@fortawesome/free-solid-svg-icons';

// array with all the dice
const icons = [faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix]


const Dice = (props) => {

    // we set the state of the dice at false at the beginning
    const [keep, setKeep] = useState(false);

    // and everytime we click on the dice, we set it to the opposite
    const keepDice = () => {
        setKeep(!keep);
        props.keepDice(props.indice, !keep); //and say it to the parent component
    }

    // we add some style when we click on it
    let style = {};
    if(keep) style = {fontSize: '4rem', margin: '20px', color: '#6b4141', transform: 'scale(1.05)'}
    else style = {fontSize: '4rem', margin: '20px', color: '#d45858'}
    
    // and render a dice with the random number provided by the parent component
    return (
        <div style={{textAlign: "center"}}>
            <FontAwesomeIcon onClick={() => keepDice()} style={style} icon={icons[props.rand]} />
        </div>
    )
}

export default Dice;