import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

export default function Account() {

    const [games, setGames] = useState([]);
    const [playGame, setPlayGame] = useState(false);

    const token = useSelector(store => store.token);
    const dispatch = useDispatch();

    const loadGames = async () => {
        const request = await fetch(`/loadgames/${token}`);
        const result = await request.json();
        setGames(result)
    }

    const selectGame = async (name) => {
        dispatch({ type: 'selectgame', game: name });
        setPlayGame(true);
    }

    if (playGame) {
        return <Redirect to="/game" />
    } else {
        return (
            <div style={style.container}>
                <Card size="small" title="Ancienne Parties" style={{ width: 300, textAlign: 'center' }}>
                    {games.map((el, i) => <p style={style.games} onClick={() => selectGame(el.name)}>{(i + 1) + ' - ' + el.name}</p>)}
                    <Button onClick={() => loadGames()} size="small" type="primary" danger ghost>Reload</Button>
                </Card>

                <Card size="small" title="Nouvelle Partie" style={{ width: 300, textAlign: 'center' }}>
                    <Link to="/NewGame">
                        <Button size="small" type="primary" danger ghost>Créer</Button>
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