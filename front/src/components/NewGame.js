/* 
 * Matthias Lechien
 *
 * last Update 26-11-21
 * 
 */

import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Button, Input, Card, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

export default function NewGame() {

    const token = useSelector(store => store.token);
    const dispatch = useDispatch();

    const [playerName, setPlayerName] = useState('');
    const [gameName, setGameName] = useState('');
    const [names, setNames] = useState([]);
    const [createGame, setCreateGame] = useState(false);


    // send a request to the backend to create a game with the players name
    const startGame = async () => {
        const request = await fetch('/create-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `names=${JSON.stringify(names)}&gamename=${gameName}&token=${token}`,
        })
        const result = await request.json();
        if (result.message) setCreateGame(true);
    }

    // add the player's name to an array with all the names
    const addPlayer = () => {
        setNames([...names, playerName]);
        setPlayerName('');
    }
 
    if (createGame) {
        dispatch({type: 'selectgame', game: gameName})
        return <Redirect to="/game" />
    }
    else {
        return (
            <div style={style.main}>
                <h1>New Game</h1>

                <Card size="small" title="New Game" style={{ width: 300 }}>
                    <p>Choose the name of the game to find it later.</p>
                    <Input onChange={(e) => setGameName(e.target.value)} value={gameName} placeholder="ex : Game 1" style={style.input} prefix={<UserOutlined />} />
                    <p>Add player's name</p>
                    <Input onChange={(e) => setPlayerName(e.target.value)} value={playerName} placeholder="John" style={style.input} prefix={<UserOutlined />} />
                    <Button onClick={() => addPlayer()} type="primary" size="small" danger ghost>Add</Button>
                </Card>

                <List
                    style={style.list}
                    size="small"
                    header={<div>Players :</div>}
                    bordered
                    dataSource={names}
                    renderItem={(item, i) => <List.Item>Player {i + 1} - {item}</List.Item>}
                />

                <Button onClick={() => startGame()} type="danger" size={'large'}>
                    Start Game
                </Button>
            </div>
        )
    }
}


const style = {
    list: {
      minWidth: '300px',
      height: 'fit-content',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    input: {
        width: '200px',
        margin: '10px',
    }
}