/* 
 * Matthias Lechien
 *
 * last Update 26-11-21
 * 
 */

import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

export default function Account() {

    const [games, setGames] = useState([]); // for the old games
    const [playGame, setPlayGame] = useState(false);

    const token = useSelector(store => store.token); // we take the user token from redux store
    const dispatch = useDispatch();

    // when you click on reload, get the old games from the DB
    const loadGames = async () => {
        const request = await fetch(`/loadgames/${token}`);
        const result = await request.json();
        setGames(result)
    }

    // when you select an old game, set the game name in redux store to remember it
    const selectGame = async (name) => {
        dispatch({ type: 'selectgame', game: name });
        setPlayGame(true); // then redirect
    }

    if (playGame) {
        return <Redirect to="/game" />
    } else {
        return (
            <div style={style.container}>
                <Card size="small" title="Old games" style={{ width: 300, textAlign: 'center' }}>
                    {games.map((el, i) => <p style={style.games} onClick={() => selectGame(el.name)}>{(i + 1) + ' - ' + el.name}</p>)}
                    <Button onClick={() => loadGames()} size="small" type="primary" danger ghost>Reload</Button>
                </Card>

                <Card size="small" title="New game" style={{ width: 300, textAlign: 'center' }}>
                    <Link to="/NewGame">
                        <Button size="small" type="primary" danger ghost>Create</Button>
                    </Link>
                </Card>
            </div>
        )
    }
}

const style = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    },
    games: {
        cursor: 'pointer',
    }
}