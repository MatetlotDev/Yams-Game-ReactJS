import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceOne } from '@fortawesome/free-solid-svg-icons';
import { faDiceTwo } from '@fortawesome/free-solid-svg-icons';
import { faDiceThree } from '@fortawesome/free-solid-svg-icons';
import { faDiceFour } from '@fortawesome/free-solid-svg-icons';
import { faDiceFive } from '@fortawesome/free-solid-svg-icons';
import { faDiceSix } from '@fortawesome/free-solid-svg-icons';

const icons = [faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix]


const Dice = (props) => {

    const [keep, setKeep] = useState(false);

    const keepDice = () => {
        setKeep(!keep);
        props.keepDice(props.indice, !keep);
    }


    let style = {};
    if(keep) style = {fontSize: '4rem', margin: '20px', color: '#6b4141', transform: 'scale(1.05)'}
    else style = {fontSize: '4rem', margin: '20px', color: '#d45858'}
    
    return (
        <div style={{textAlign: "center"}}>
            <FontAwesomeIcon onClick={() => keepDice()} style={style} icon={icons[props.rand]} />
        </div>
    )
}

export default Dice;