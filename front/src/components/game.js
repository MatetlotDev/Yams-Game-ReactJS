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
    const [nbrTour, setNbrTour] = useState(0);
    const [currentP, setCurrentP] = useState(1);
    const [winner, setWinner] = useState('');
    const [player1Name, setPlayer1Name] = useState('');
    const [player2Name, setPlayer2Name] = useState('');


    useEffect(() => {
        const loadGrid = async () => {
            const request = await fetch('/get-grid')
            const result = await request.json();
            const grids = [result[0].grid, result[1].grid]
            setGrid(grids)
            setPlayer1Name(result[0].name);
            setPlayer2Name(result[1].name);
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



    const startOver = () => {
        async function deleteGrid() {
            await fetch('/delete-grid', {
                method: 'DELETE',
            })
        }
        async function createGrid() {
            const requete = await fetch('/create-grid');
            const result = await requete.json();
            setGrid([result[0].grid, result[1].grid]);
        }
        deleteGrid();
        createGrid();
        setCompteur(0);
        setCurrentP(1);
        setScoreList([]);
        setWinner('');
        tab = ['-', '-', '-', '-', '-'];
    }



    let totalExist = '';
    let total = scoreList.reduce((a, b) => a + b, 5);
    if (total > 5) totalExist = total;



    const nextPlayer = () => {
        tab = ['-', '-', '-', '-', '-'];
        setScoreList([])
        setCompteur(0);
        currentP === 1 ? setCurrentP(2) : setCurrentP(1);
        setNbrTour(nbrTour + 1);
    }



    const writeScore = async (player, row) => {
        let newGrid = [...grid];

        //--- condition pour chaque case --- //

        switch (row) {

            case 'as':
                const arr0 = scoreList.map(e => e === 0 ? 1 : 0)
                const sum0 = arr0.reduce((a, b) => a + b);
                if (currentP === 1 && player === 1 && newGrid[0].as === null) newGrid[0].as = sum0;
                else if (currentP === 2 && player === 2 && newGrid[1].as === null) newGrid[1].as = sum0;
                break;

            case 'two':
                const arr1 = scoreList.map(e => e === 1 ? 2 : 0)
                const sum1 = arr1.reduce((a, b) => a + b);
                if (currentP === 1 && player === 1 && newGrid[0].two === null) newGrid[0].two = sum1;
                else if (currentP === 2 && player === 2 && newGrid[1].two === null) newGrid[1].two = sum1;

                break;

            case 'three':
                const arr2 = scoreList.map(e => e === 2 ? 3 : 0)
                const sum2 = arr2.reduce((a, b) => a + b);
                if (currentP === 1 && player === 1 && newGrid[0].three === null) newGrid[0].three = sum2;
                else if (currentP === 2 && player === 2 && newGrid[1].three === null) newGrid[1].three = sum2;
                break;

            case 'four':
                const arr3 = scoreList.map(e => e === 3 ? 4 : 0)
                const sum3 = arr3.reduce((a, b) => a + b);
                if (currentP === 1 && player === 1 && newGrid[0].four === null) newGrid[0].four = sum3;
                else if (currentP === 2 && player === 2 && newGrid[1].four === null) newGrid[1].four = sum3;
                break;

            case 'five':
                const arr4 = scoreList.map(e => e === 4 ? 5 : 0)
                const sum4 = arr4.reduce((a, b) => a + b);
                if (currentP === 1 && player === 1 && newGrid[0].five === null) newGrid[0].five = sum4;
                else if (currentP === 2 && player === 2 && newGrid[1].five === null) newGrid[1].five = sum4;
                break;

            case 'six':
                const arr5 = scoreList.map(e => e === 5 ? 6 : 0)
                const sum5 = arr5.reduce((a, b) => a + b);
                if (currentP === 1 && player === 1 && newGrid[0].six === null) newGrid[0].six = sum5;
                else if (currentP === 2 && player === 2 && newGrid[1].six === null) newGrid[1].six = sum5;
                break;

            case 'max':
                if (currentP === 1 && player === 1 && newGrid[0].max === null) newGrid[0].max = total;
                else if (currentP === 2 && player === 2 && newGrid[1].max === null) newGrid[1].max = total;
                break;

            case 'min':
                if (currentP === 1 && player === 1 && newGrid[0].min === null) newGrid[0].min = total;
                else if (currentP === 2 && player === 2 && newGrid[1].min === null) newGrid[1].min = total;
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
                    if (currentP === 1 && player === 1 && newGrid[0].brelan === null) newGrid[0].brelan = total;
                    else if (currentP === 2 && player === 2 && newGrid[1].brelan === null) newGrid[1].brelan = total;
                } else {
                    if (currentP === 1 && player === 1 && newGrid[0].brelan === null) newGrid[0].brelan = 0;
                    else if (currentP === 2 && player === 2 && newGrid[1].brelan === null) newGrid[1].brelan = 0;
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
                    if (currentP === 1 && player === 1 && newGrid[0].smSuite === null) newGrid[0].smSuite = 30;
                    else if (currentP === 2 && player === 2 && newGrid[1].smSuite === null) newGrid[1].smSuite = 30;
                } else {
                    if (currentP === 1 && player === 1 && newGrid[0].smSuite === null) newGrid[0].smSuite = 0;
                    else if (currentP === 2 && player === 2 && newGrid[1].smSuite === null) newGrid[1].smSuite = 0;
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
                    if (currentP === 1 && player === 1 && newGrid[0].bgSuite === null) newGrid[0].bgSuite = 40;
                    else if (currentP === 2 && player === 2 && newGrid[1].bgSuite === null) newGrid[1].bgSuite = 40;
                } else {
                    if (currentP === 1 && player === 1 && newGrid[0].bgSuite === null) newGrid[0].bgSuite = 0;
                    else if (currentP === 2 && player === 2 && newGrid[1].bgSuite === null) newGrid[1].bgSuite = 0;
                }
                break;

            case 'full':
                const full = scoreList.filter((item, pos) => scoreList.indexOf(item) == pos)
                if (full.length === 2) {
                    if (currentP === 1 && player === 1 && newGrid[0].full === null) newGrid[0].full = 25;
                    else if (currentP === 2 && player === 2 && newGrid[1].full === null) newGrid[1].full = 25;
                } else {
                    if (currentP === 1 && player === 1 && newGrid[0].full === null) newGrid[0].full = 0;
                    else if (currentP === 2 && player === 2 && newGrid[1].full === null) newGrid[1].full = 0;
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
                    if (currentP === 1 && player === 1 && newGrid[0].square === null) newGrid[0].square = total;
                    else if (currentP === 2 && player === 2 && newGrid[1].square === null) newGrid[1].square = total;
                } else {
                    if (currentP === 1 && player === 1 && newGrid[0].square === null) newGrid[0].square = 0;
                    else if (currentP === 2 && player === 2 && newGrid[1].square === null) newGrid[1].square = 0;
                }
                break;

            case 'yams':
                const same = scoreList.every(el => el === scoreList[0])
                if (same) {
                    if (currentP === 1 && player === 1 && newGrid[0].yams === null) newGrid[0].yams = 50;
                    else if (currentP === 2 && player === 2 && newGrid[1].yams === null) newGrid[1].yams = 50;
                } else {
                    if (currentP === 1 && player === 1 && newGrid[0].yams === null) newGrid[0].yams = 0;
                    else if (currentP === 2 && player === 2 && newGrid[1].yams === null) newGrid[1].yams = 0;
                }
                break;

            case 'chance':
                if (currentP === 1 && player === 1 && newGrid[0].chance === null) newGrid[0].chance = total;
                else if (currentP === 2 && player === 2 && newGrid[1].chance === null) newGrid[1].chance = total;
                break;
        }



        // --- total 0 --- //
        if (newGrid[0].as !== null && newGrid[0].two !== null && newGrid[0].three !== null && newGrid[0].four !== null && newGrid[0].five !== null && newGrid[0].six !== null) {
            newGrid[0].total = newGrid[0].as + newGrid[0].two + newGrid[0].three + newGrid[0].four + newGrid[0].five + newGrid[0].six;
        }
        if (newGrid[1].as !== null && newGrid[1].two !== null && newGrid[1].three !== null && newGrid[1].four !== null && newGrid[1].five !== null && newGrid[1].six !== null) {
            newGrid[1].total = newGrid[1].as + newGrid[1].two + newGrid[1].three + newGrid[1].four + newGrid[1].five + newGrid[1].six;
        }

        //--- prime --- //
        if (newGrid[0].total !== null) newGrid[0].total > 63 ? newGrid[0].bonus = 35 : newGrid[0].bonus = 0;
        if (newGrid[1].total !== null) newGrid[1].total > 63 ? newGrid[1].bonus = 35 : newGrid[1].bonus = 0;

        // --- total 1 --- //
        if (newGrid[0].bonus !== null) newGrid[0].total1 = newGrid[0].bonus + newGrid[0].total;
        if (newGrid[1].bonus !== null) newGrid[1].total1 = newGrid[1].bonus + newGrid[1].total;

        // ---total 2 --- //
        if (newGrid[0].max !== null && newGrid[0].min !== null) newGrid[0].total2 = newGrid[0].max - newGrid[0].min;
        if (newGrid[1].max !== null && newGrid[1].min !== null) newGrid[1].total2 = newGrid[1].max - newGrid[1].min;

        // --- total 3 --- //
        if (newGrid[0].brelan !== null && newGrid[0].smSuite !== null && newGrid[0].bgSuite !== null && newGrid[0].full !== null && newGrid[0].square !== null && newGrid[0].yams !== null) {
            newGrid[0].total3 = newGrid[0].brelan + newGrid[0].smSuite + newGrid[0].bgSuite + newGrid[0].full + newGrid[0].square + newGrid[0].yams;
        }
        if (newGrid[1].brelan !== null && newGrid[1].smSuite !== null && newGrid[1].bgSuite !== null && newGrid[1].full !== null && newGrid[1].square !== null && newGrid[1].yams !== null) {
            newGrid[1].total3 = newGrid[1].brelan + newGrid[1].smSuite + newGrid[1].bgSuite + newGrid[1].full + newGrid[1].square + newGrid[1].yams;
        }

        //--- total 4 ---//
        if (newGrid[0].total !== null && newGrid[0].total1 !== null && newGrid[0].total2 !== null && newGrid[0].total3 !== null) {
            newGrid[0].total4 = newGrid[0].total + newGrid[0].total1 + newGrid[0].total2 + newGrid[0].total3
        }
        if (newGrid[1].total !== null && newGrid[1].total1 !== null && newGrid[1].total2 !== null && newGrid[1].total3 !== null) {
            newGrid[1].total4 = newGrid[1].total + newGrid[1].total1 + newGrid[1].total2 + newGrid[1].total3
        }


        const requete = await fetch('/update-grid', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `player=${player}&grid=${JSON.stringify(newGrid)}`,
        })
        const result = await requete.json();

        setGrid([result[0].grid, result[1].grid]);

        if (newGrid[0].total4 && newGrid[1].total4) {
            newGrid[0].total4 > newGrid[1].total4 ? setWinner('Player 1 Won !') : setWinner('Player 2 Won !');
            nextPlayer();
        }

        if (currentP === player) {
            nextPlayer();
        }
    }


    if (grid.length === 0) {
        return ''
    } else {
        return (
            <div style={styleContainer}>
                <div>
                    <div onClick={() => startGame()} style={buttonStyle}>Lancer les dés</div>
                    <p>Total : {totalExist}</p>
                    <p>Current player : {currentP}</p>
                    <p>Nombre de lancé : {compteur}</p>
                    <table>
                        <tbody>
                            <tr>
                                <td>JOUEURS</td>
                                <td>{player1Name}</td>
                                <td>{player2Name}</td>
                            </tr>
                            <tr>
                                <td>AS</td>
                                <td onClick={() => writeScore(1, 'as')}>{grid[0].as}</td>
                                <td onClick={() => writeScore(2, 'as')}>{grid[1].as}</td>
                            </tr>
                            <tr>
                                <td>TWO</td>
                                <td onClick={() => writeScore(1, 'two')}>{grid[0].two}</td>
                                <td onClick={() => writeScore(2, 'two')}>{grid[1].two}</td>
                            </tr>
                            <tr>
                                <td>THREE</td>
                                <td onClick={() => writeScore(1, 'three')}>{grid[0].three}</td>
                                <td onClick={() => writeScore(2, 'three')}>{grid[1].three}</td>
                            </tr>
                            <tr>
                                <td>FOUR</td>
                                <td onClick={() => writeScore(1, 'four')}>{grid[0].four}</td>
                                <td onClick={() => writeScore(2, 'four')}>{grid[1].four}</td>
                            </tr>
                            <tr>
                                <td>FIVE</td>
                                <td onClick={() => writeScore(1, 'five')}>{grid[0].five}</td>
                                <td onClick={() => writeScore(2, 'five')}>{grid[1].five}</td>
                            </tr>
                            <tr>
                                <td>SIX</td>
                                <td onClick={() => writeScore(1, 'six')}>{grid[0].six}</td>
                                <td onClick={() => writeScore(2, 'six')}>{grid[1].six}</td>
                            </tr>
                            <tr>
                                <td>TOTAL</td>
                                <td>{grid[0].total}</td>
                                <td>{grid[1].total}</td>
                            </tr>
                            <tr>
                                <td>BONUS</td>
                                <td>{grid[0].bonus}</td>
                                <td>{grid[1].bonus}</td>
                            </tr>
                            <tr>
                                <td>TOTAL1</td>
                                <td>{grid[0].total1}</td>
                                <td>{grid[1].total1}</td>
                            </tr>
                            <tr>
                                <td>MAX</td>
                                <td onClick={() => writeScore(1, 'max')}>{grid[0].max}</td>
                                <td onClick={() => writeScore(2, 'max')}>{grid[1].max}</td>
                            </tr>
                            <tr>
                                <td>MIN</td>
                                <td onClick={() => writeScore(1, 'min')}>{grid[0].min}</td>
                                <td onClick={() => writeScore(2, 'min')}>{grid[1].min}</td>
                            </tr>
                            <tr>
                                <td>TOTAL2</td>
                                <td>{grid[0].total2}</td>
                                <td>{grid[1].total2}</td>
                            </tr>
                            <tr>
                                <td>BRELAN</td>
                                <td onClick={() => writeScore(1, 'brelan')}>{grid[0].brelan}</td>
                                <td onClick={() => writeScore(2, 'brelan')}>{grid[1].brelan}</td>
                            </tr>
                            <tr>
                                <td>Pt. SUITE</td>
                                <td onClick={() => writeScore(1, 'smsuite')}>{grid[0].smSuite}</td>
                                <td onClick={() => writeScore(2, 'smsuite')}>{grid[1].smSuite}</td>
                            </tr>
                            <tr>
                                <td>Grd. SUITE</td>
                                <td onClick={() => writeScore(1, 'bgsuite')}>{grid[0].bgSuite}</td>
                                <td onClick={() => writeScore(2, 'bgsuite')}>{grid[1].bgSuite}</td>
                            </tr>
                            <tr>
                                <td>FULL</td>
                                <td onClick={() => writeScore(1, 'full')}>{grid[0].full}</td>
                                <td onClick={() => writeScore(2, 'full')}>{grid[1].full}</td>
                            </tr>
                            <tr>
                                <td>CARRE</td>
                                <td onClick={() => writeScore(1, 'square')}>{grid[0].square}</td>
                                <td onClick={() => writeScore(2, 'square')}>{grid[1].square}</td>
                            </tr>
                            <tr>
                                <td>YAMS</td>
                                <td onClick={() => writeScore(1, 'yams')}>{grid[0].yams}</td>
                                <td onClick={() => writeScore(2, 'yams')}>{grid[1].yams}</td>
                            </tr>
                            <tr>
                                <td>CHANCE</td>
                                <td onClick={() => writeScore(1, 'chance')}>{grid[0].chance}</td>
                                <td onClick={() => writeScore(2, 'chance')}>{grid[1].chance}</td>
                            </tr>
                            <tr>
                                <td>TOTAL3</td>
                                <td>{grid[0].total3}</td>
                                <td>{grid[1].total3}</td>
                            </tr>
                            <tr>
                                <td>TOTAL4</td>
                                <td>{grid[0].total4}</td>
                                <td>{grid[1].total4}</td>
                            </tr>
                        </tbody>
                    </table>
                    <Link to='/'>
                        <button>Recommencer</button>
                    </Link>
                </div>

                <div>{winner}</div>

                <div>{diceList}</div>

            </div>
        );
    }
}


