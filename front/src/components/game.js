/* 
 * Matthias Lechien
 *
 * last Update 26-11-21
 * 
 */


// ---classic IMPORTS --- //
import React, { useState, useEffect } from 'react';
import Dice from './dice';
import '../App.css';
import { Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';



// Initialise an array with five '-' wich gonna serve after for the score of the dice
let tab = ['-', '-', '-', '-', '-']; 


export default function Game() {

    const token = useSelector(store => store.token); //the token of the user from redux store
    const gameName = useSelector(store => store.gamename); //the name of the game from redux store

    const [grid, setGrid] = useState([]); //an array of object where each object are the grid of the player
    const [scoreList, setScoreList] = useState([]); //an array of 5 number, wich are the five dices
    const [compteur, setCompteur] = useState(0); //the number of throws by player (3x each)
    const [currentP, setCurrentP] = useState(1); //the player's turn
    const [winner, setWinner] = useState(''); // set the winner at the end
    const [names, setNames] = useState([]); //an array with the names of the players
    const [redirectAccount, setRedirectAccount] = useState(false) //redirection state to go back on the Account Screen


    // on the load of the component : 
    useEffect(() => {
        const loadGrid = async () => {
            // request the server to get the game we want
            const request = await fetch(`/get-grid/${token}/${gameName}`)//takes to parameters to find the game
            const result = await request.json();

            // if last player was the n°1 -> set current player to 2
            // if last player was last one -> set current player to 1
            result.lastPlayer === result.players.length ? setCurrentP(1) : setCurrentP(result.lastPlayer + 1)

            // sets the grids for each players grid[0] -> grid of player 0 but (currentP = 1) ...I know
            const grids = result.players.map(el => el.grid)
            setGrid(grids)

            // sets the array of names names[0] = players0 name
            const name = result.players.map(el => el.name);
            setNames(name);
        }
        loadGrid();
    }, [])


    // function called when you throw the dices
    const startGame = async () => {
        if (compteur < 3) {//only play if the player have thrown less then 3 times
            let scores = []; //initialise an empty array
            for (let i = 0; i < 5; i++) { 
                // we compare with the array tab, if it's '-' -> we push and random number
                if (tab[i] === '-') scores.push(Math.floor(Math.random() * 6)) // (6 for 6 face of a dice)
                else scores.push(tab[i]); // otherwise we leave the number that is already there
            }
            setScoreList(scores); //set the scoreList with the new numbers
            setCompteur(compteur + 1); //increment the count
        }
    }

    // when you click on a dice -> takes two parameters : the position in the array and a boolean
    // we watch trought the array tab and check for the dice we have clicked on
    // if there's a '-' & we have true we replace it by a random number
    // if we have false, we replace it by a '-'
    const keepDice = (indice, isSelected) => {
        for (let i = 0; i < 5; i++) {
            if (indice === i) {
                if (tab[i] === '-' && isSelected) {
                    tab.splice(i, 1, scoreList[indice])
                } else if (!isSelected) tab.splice(i, 1, '-')
            }
        }
    }

    // for each number of scoreList we create a component Dice with a props rand that is the random number
    let diceList = scoreList.map((el, i) => <Dice indice={i} keepDice={keepDice} rand={el} />)

    let totalExist = 0; // when we didn't throw the dice yet, we set the total to 0
    let total = scoreList.reduce((a, b) => a + b, 5); //make the sum of the scoreList plus 5 (one on a dice = 0, two = 1, ...)
    if (total > 5) totalExist = total; //if it's greater then 5 we set the total to the real total, 5 beeing the min


    // function beeing played each time a player write his score
    const nextPlayer = () => { //set evrything back to the beginning
        tab = ['-', '-', '-', '-', '-'];
        setScoreList([])
        setCompteur(0);
        currentP === names.length ? setCurrentP(1) : setCurrentP(currentP + 1) //increment the player unless it's the last one
    }


    // when you click on the button delete game, delete the game from the DB and redirect to account screen
    const deleteGame = async () => {
        const request = await fetch(`/deletegame/${token}/${gameName}`, {
            method: 'DELETE',
        })
        const result = await request.json();
        if(result.message) setRedirectAccount(true);
    }


    // --- Main function to write score in the players grid --- //
    const writeScore = async (player, row) => {
        if (scoreList.length !== 0) { // only write the score if we have thrown the dice

            let newGrid = [...grid]; //make a copy of the actual players grid

            //--- condition for each scenario  --- //
            // I'll let you enjoy the understanding of each ;)

            switch (row) {

                case 'as':
                    const arr0 = scoreList.map(e => e === 0 ? 1 : 0)
                    const sum0 = arr0.reduce((a, b) => a + b);
                    names.forEach((el, i) => {
                        if (currentP === i + 1 && player === i && newGrid[i].as === null) newGrid[i].as = sum0;
                    })
                    break;

                case 'two':
                    const arr1 = scoreList.map(e => e === 1 ? 2 : 0)
                    const sum1 = arr1.reduce((a, b) => a + b);
                    names.forEach((el, i) => {
                        if (currentP === i + 1 && player === i && newGrid[i].two === null) newGrid[i].two = sum1;
                    })
                    break;

                case 'three':
                    const arr2 = scoreList.map(e => e === 2 ? 3 : 0)
                    const sum2 = arr2.reduce((a, b) => a + b);
                    names.forEach((el, i) => {
                        if (currentP === i + 1 && player === i && newGrid[i].three === null) newGrid[i].three = sum2;
                    })
                    break;

                case 'four':
                    const arr3 = scoreList.map(e => e === 3 ? 4 : 0)
                    const sum3 = arr3.reduce((a, b) => a + b);
                    names.forEach((el, i) => {
                        if (currentP === i + 1 && player === i && newGrid[i].four === null) newGrid[i].four = sum3;
                    })
                    break;

                case 'five':
                    const arr4 = scoreList.map(e => e === 4 ? 5 : 0)
                    const sum4 = arr4.reduce((a, b) => a + b);
                    names.forEach((el, i) => {
                        if (currentP === i + 1 && player === i && newGrid[i].five === null) newGrid[i].five = sum4;
                    })
                    break;

                case 'six':
                    const arr5 = scoreList.map(e => e === 5 ? 6 : 0)
                    const sum5 = arr5.reduce((a, b) => a + b);
                    names.forEach((el, i) => {
                        if (currentP === i + 1 && player === i && newGrid[i].six === null) newGrid[i].six = sum5;
                    })
                    break;

                case 'max':
                    names.forEach((el, i) => {
                        if (currentP === i + 1 && player === i && newGrid[i].max === null) newGrid[i].max = total;
                    })
                    break;

                case 'min':
                    names.forEach((el, i) => {
                        if (currentP === i + 1 && player === i && newGrid[i].min === null) newGrid[i].min = total;
                    })
                    break;

                // not sure about this one, there could be a better way
                case 'brelan':
                    const countB = {};
                    let brelan = false;
                    scoreList.forEach(el => {
                        if (countB[el]) {
                            countB[el] += 1;
                            return
                        } countB[el] = 1;
                    })
                    for (let i = 0; i <= 5; i++) if (countB[i] >= 3) brelan = true

                    if (brelan) {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].brelan === null) newGrid[i].brelan = total;
                        })
                    } else {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].brelan === null) newGrid[i].brelan = 0;
                        })
                    }
                    break;

                // same for this one, it doesn't work all the time
                case 'smsuite':
                    const sortedsm = scoreList.sort().filter((item, pos) => scoreList.indexOf(item) == pos);
                    let suitesm = 0;
                    if (sortedsm[0] === 0 && sortedsm[1] !== 1) {
                        for (let i = sortedsm.length - 1; i >= 2; i--) {
                            if (sortedsm[i] === sortedsm[i - 1] + 1) suitesm++;
                        }
                    } else {
                        for (let i = 0; i < 3; i++) {
                            if (sortedsm[i] + 1 === sortedsm[i + 1]) suitesm++;
                        }
                    }
                    if (suitesm === 3) {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].smSuite === null) newGrid[i].smSuite = 30;
                        })
                    } else {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].smSuite === null) newGrid[i].smSuite = 0;
                        })
                    }
                    break;

                case 'bgsuite':
                    const sorted = scoreList.sort();
                    let suite = false;
                    for (let i = 0; i < sorted.length - 1; i++) {
                        suite = false;
                        if (sorted[i] + 1 == sorted[i + 1]) suite = true;
                    }
                    if (suite) {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].bgSuite === null) newGrid[i].bgSuite = 40;
                        })
                    } else {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].bgSuite === null) newGrid[i].bgSuite = 0;
                        })
                    }
                    break;

                case 'full':
                    const full = scoreList.filter((item, pos) => scoreList.indexOf(item) == pos)
                    if (full.length === 2) {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].full === null) newGrid[i].full = 25;
                        })
                    } else {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].full === null) newGrid[i].full = 0;
                        })
                    }
                    break;

                case 'square':
                    const count = {};
                    scoreList.forEach(el => {
                        if (count[el]) {
                            count[el] += 1;
                            return
                        } count[el] = 1;
                    })
                    if (count[0] === 4 || count[1] === 4 || count[2] === 4 || count[3] === 4 || count[4] === 4 || count[5] === 4) {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].square === null) newGrid[i].square = total;
                        })
                    } else {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].square === null) newGrid[i].square = 0;
                        })
                    }
                    break;

                case 'yams':
                    const same = scoreList.every(el => el === scoreList[0])
                    if (same) {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].yams === null) newGrid[i].yams = 50;
                        })
                    } else {
                        names.forEach((el, i) => {
                            if (currentP === i + 1 && player === i && newGrid[i].yams === null) newGrid[i].yams = 0;
                        })
                    }
                    break;

                case 'chance':
                    names.forEach((el, i) => {
                        if (currentP === i + 1 && player === i && newGrid[i].chance === null) newGrid[i].chance = total;
                    })
                    break;
            }


            //  --- Sum of all the totals ---  //

            // --- total 0 --- //
            names.forEach((el, i) => {
                if (newGrid[i].as !== null && newGrid[i].two !== null && newGrid[i].three !== null && newGrid[i].four !== null && newGrid[i].five !== null && newGrid[i].six !== null) {
                    newGrid[i].total = newGrid[i].as + newGrid[i].two + newGrid[i].three + newGrid[i].four + newGrid[i].five + newGrid[i].six;
                }
            })

            //--- bonus --- //  (if the score of total zero is greater than 63, there's a bonus)
            names.forEach((el, i) => {
                if (newGrid[i].total !== null) newGrid[i].total > 63 ? newGrid[i].bonus = 35 : newGrid[i].bonus = 0;
            })

            // --- total 1 --- //
            names.forEach((el, i) => {
                if (newGrid[i].bonus !== null) newGrid[i].total1 = newGrid[i].bonus + newGrid[i].total;
            })

            // ---total 2 --- //
            names.forEach((el, i) => {
                if (newGrid[i].max !== null && newGrid[i].min !== null) newGrid[i].total2 = newGrid[i].max - newGrid[i].min;
            })

            // --- total 3 --- //
            names.forEach((el, i) => {
                if (newGrid[i].brelan !== null && newGrid[i].smSuite !== null && newGrid[i].bgSuite !== null && newGrid[i].full !== null && newGrid[i].square !== null && newGrid[i].yams !== null) {
                    newGrid[i].total3 = newGrid[i].brelan + newGrid[i].smSuite + newGrid[i].bgSuite + newGrid[i].full + newGrid[i].square + newGrid[i].yams;
                }
            })

            //--- total 4 ---//
            names.forEach((el, i) => {
                if (newGrid[i].total !== null && newGrid[i].total1 !== null && newGrid[i].total2 !== null && newGrid[i].total3 !== null) {
                    newGrid[i].total4 = newGrid[i].total + newGrid[i].total1 + newGrid[i].total2 + newGrid[i].total3
                }
            })


            // if the the first one have a score in total4 that means all the others have finished, because he is the last one to start
            if (newGrid[0].total4) {
                const endingScores = newGrid.map(el => el.total4);
                let winner = 0;
                let max = endingScores[0];
                for (let i = 1; i < endingScores.length; ++i) { // we check wich score is the bigger
                    if (endingScores[i] > max) {
                        max = endingScores[i];
                        winner = i; // and remember the position like so
                    }
                }
                setWinner(`Player ${winner+1} - ${names[winner]} won the game !`);
                nextPlayer(); // we play next player to remove the dice from the screen
            }


            // we only update the grid if the column clicked on is the same then the current player 
            if (currentP === player + 1) {
                const requete = await fetch('/update-grid', { // request the backend to update the grid 
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `gamename=${gameName}&player=${player}&grid=${JSON.stringify(newGrid)}&token=${token}`,
                })// to find the grid we need the gamename, the actual player, and the user token
                const result = await requete.json();

                //we get back the game updated and set our actual grid with only the grids of the players
                newGrid = result.map(el => el.grid)
                setGrid(newGrid);
                nextPlayer(); // and it's next player's turn
            }
        }
    }


    // I povided this, because, it's not fast enought at the loading of the game screen
    // so it doesn't show error like grid[0].total4 is undefined
    if (grid.length === 0) {
        return ''
    }else if(redirectAccount){ // when you click on account or delete game
        return <Redirect to="/Account"/>
    }else {
        return ( // a really basic grid made with a table 
            <div style={styleContainer}>
                <div style={{display: 'flex'}}>
                    <div style={{marginRight: '30px'}}>
                        <div onClick={() => startGame()} style={buttonStyle}>Throw Dice</div>
                        <p>Actual score : {total}</p>
                        <p>It's <strong>{names[currentP - 1] + "'s"}</strong> turn</p>
                        <p>Count of throw : {compteur}</p>
                        <Link to='/Account'>
                            <button>Account</button>
                        </Link>
                        <button onClick={() => deleteGame()}>Delete game</button>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Players</td>
                                {names.map(el => <td>{el[0].toUpperCase()}</td>)}
                            </tr>
                            <tr>
                                <td>AS</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'as')}>{grid[i].as}</td>)}
                            </tr>
                            <tr>
                                <td>TWO</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'two')}>{grid[i].two}</td>)}
                            </tr>
                            <tr>
                                <td>THREE</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'three')}>{grid[i].three}</td>)}
                            </tr>
                            <tr>
                                <td>FOUR</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'four')}>{grid[i].four}</td>)}
                            </tr>
                            <tr>
                                <td>FIVE</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'five')}>{grid[i].five}</td>)}
                            </tr>
                            <tr>
                                <td>SIX</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'six')}>{grid[i].six}</td>)}
                            </tr>
                            <tr>
                                <td><strong>TOTAL</strong></td>
                                {names.map((el, i) => <td>{grid[i].total}</td>)}
                            </tr>
                            <tr>
                                <td>BONUS</td>
                                {names.map((el, i) => <td>{grid[i].bonus}</td>)}
                            </tr>
                            <tr>
                                <td><strong>TOTAL 1</strong></td>
                                {names.map((el, i) => <td>{grid[i].total1}</td>)}
                            </tr>
                            <tr>
                                <td>MAX</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'max')}>{grid[i].max}</td>)}
                            </tr>
                            <tr>
                                <td>MIN</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'min')}>{grid[i].min}</td>)}
                            </tr>
                            <tr>
                                <td><strong>TOTAL 2</strong></td>
                                {names.map((el, i) => <td>{grid[i].total2}</td>)}
                            </tr>
                            <tr>
                                <td>BRELAN</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'brelan')}>{grid[i].brelan}</td>)}
                            </tr>
                            <tr>
                                <td>Pt. SUITE</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'smsuite')}>{grid[i].smSuite}</td>)}
                            </tr>
                            <tr>
                                <td style={{minWidth: '80px'}}>Grd. SUITE</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'bgsuite')}>{grid[i].bgSuite}</td>)}
                            </tr>
                            <tr>
                                <td>FULL</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'full')}>{grid[i].full}</td>)}
                            </tr>
                            <tr>
                                <td>CARRE</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'square')}>{grid[i].square}</td>)}
                            </tr>
                            <tr>
                                <td>YAMS</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'yams')}>{grid[i].yams}</td>)}
                            </tr>
                            <tr>
                                <td>CHANCE</td>
                                {names.map((el, i) => <td onClick={() => writeScore(i, 'chance')}>{grid[i].chance}</td>)}
                            </tr>
                            <tr>
                                <td><strong>TOTAL3</strong></td>
                                {names.map((el, i) => <td>{grid[i].total3}</td>)}
                            </tr>
                            <tr>
                                <td><strong>TOTAL4</strong></td>
                                {names.map((el, i) => <td>{grid[i].total4}</td>)}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>{winner}</div>

                <div style={{minWidth: '300px'}}>{diceList}</div>

            </div>
        );
    }
}

const styleContainer = {
    display: 'flex',
    width: '100%',
    height: '100vh',
    alignItems: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
}
const buttonStyle = {
    fontSize: '1rem',
    padding: '10px',
    borderRadius: '15px',
    backgroundColor: 'coral',
    color: '#fff',
    cursor: 'pointer',
}


