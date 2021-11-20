import React, { useState, useEffect } from 'react';
import Dice from './dice';
import '../App.css';
import { Link } from 'react-router-dom';

import { faDiceOne } from '@fortawesome/free-solid-svg-icons';
import { faDiceTwo } from '@fortawesome/free-solid-svg-icons';
import { faDiceThree } from '@fortawesome/free-solid-svg-icons';
import { faDiceFour } from '@fortawesome/free-solid-svg-icons';
import { faDiceFive } from '@fortawesome/free-solid-svg-icons';
import { faDiceSix } from '@fortawesome/free-solid-svg-icons';

const icons = [faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix]

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


let tab = ['-', '-', '-', '-', '-'];


export default function Game() {

    const [grid, setGrid] = useState([]);
    const [scoreList, setScoreList] = useState([]);
    const [compteur, setCompteur] = useState(0);
    const [currentP, setCurrentP] = useState(1);
    const [winner, setWinner] = useState('');
    const [names, setNames] = useState([]);


    useEffect(() => {
        const loadGrid = async () => {
            const request = await fetch('/get-grid')
            const result = await request.json();
            const grids = result.map(el => el.grid)
            setGrid(grids)
            const name = result.map(el => el.name);
            setNames(name);
        }
        loadGrid();
    }, [])

    // quand on clique sur un dé, on tourne dans un tableau
    //  on regarde si l'indice correspond au tour de boucle
    // si oui on regarde si il y a un tiret ou un numéro
    // si c'est un tiret on remplace par le numéro correspondant
    // si non on regarde si il est sélectionné ou pas et on l'enlève ou non
    const keepDice = (indice, isSelected) => {
        for (let i = 0; i < 5; i++) {
            if (indice === i) {
                if (tab[i] === '-' && isSelected) {
                    tab.splice(i, 1, scoreList[indice])
                } else if (!isSelected) tab.splice(i, 1, '-')
            }
        }
    }

    let diceList = scoreList.map((el, i) => <Dice indice={i} keepDice={keepDice} rand={el} />)


    const startGame = async () => {
        if (compteur < 3) {
            let scores = [];
            for (let i = 0; i < 5; i++) {
                if (tab[i] === '-') scores.push(Math.floor(Math.random() * icons.length))
                else scores.push(tab[i]);
            }
            setScoreList(scores);
            setCompteur(compteur + 1);
        }
    }


    let totalExist = '';
    let total = scoreList.reduce((a, b) => a + b, 5);
    if (total > 5) totalExist = total;



    const nextPlayer = () => {
        console.log('next')
        tab = ['-', '-', '-', '-', '-'];
        setScoreList([])
        setCompteur(0);
        currentP === names.length ? setCurrentP(1) : setCurrentP(currentP + 1)
    }



    const writeScore = async (player, row) => {
        if (scoreList.length !== 0) {

            let newGrid = [...grid];

            //--- condition pour chaque case --- //

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



            // --- total 0 --- //
            names.forEach((el, i) => {
                if (newGrid[i].as !== null && newGrid[i].two !== null && newGrid[i].three !== null && newGrid[i].four !== null && newGrid[i].five !== null && newGrid[i].six !== null) {
                    newGrid[i].total = newGrid[i].as + newGrid[i].two + newGrid[i].three + newGrid[i].four + newGrid[i].five + newGrid[i].six;
                }
            })

            //--- prime --- //
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


            if (newGrid[names.length - 1].total4) {
                const endingScores = newGrid.map(el => el.total4);
                let winner = 0;
                let max = endingScores[0];
                for (let i = 1; i < endingScores.length; ++i) {
                    if (endingScores[i] > max) {
                        max = endingScores[i];
                        winner = i;
                    }
                }
                setWinner(`Player ${winner+1} - ${names[winner]} won the game !`);
                nextPlayer();
            }


            console.log(player, currentP)
            console.log(newGrid[player].smSuite)
            // On ne met à jour la grille que si la case cliquée est bien celle du joueur actuel
            if (currentP === player + 1) {
                console.log('update')
                const requete = await fetch('/update-grid', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `player=${player}&grid=${JSON.stringify(newGrid)}`,
                })
                const result = await requete.json();

                newGrid = result.map(el => el.grid)
                console.log(newGrid)
                setGrid(newGrid);
                nextPlayer();
            }
        }
    }


    if (grid.length === 0) {
        return ''
    } else {
        return (
            <div style={styleContainer}>
                <div style={{display: 'flex'}}>
                    <div style={{marginRight: '30px'}}>
                        <div onClick={() => startGame()} style={buttonStyle}>Lancer les dés</div>
                        <p>Score actuel : {totalExist}</p>
                        <p>C'est au tour de <strong>{names[currentP - 1]}</strong></p>
                        <p>Nombre de lancé : {compteur}</p>
                        <Link to='/'>
                            <button>Recommencer</button>
                        </Link>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <td>JOUEURS</td>
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


