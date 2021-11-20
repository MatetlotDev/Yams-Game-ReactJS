import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Button, Input, Card, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Homepage() {

    const [playerName, setPlayerName] = useState('');
    const [names, setNames] = useState([]);
    const [createGame, setCreateGame] = useState(false);


    const buttonClick = async () => {
        console.log(names)
        const request = await fetch('/create-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `names=${JSON.stringify(names)}`,
        })
        const result = await request.json();
        if (result.message) setCreateGame(true);
    }

    const addPlayer = () => {
        setNames([...names, playerName]);
        setPlayerName('');
    }
 
    if (createGame) {
        return <Redirect to="/game" />
    }
    else {
        return (
            <div style={style.main}>
                <h1>Yams Game</h1>

                <Card size="small" title="Add Player" style={{ width: 300 }}>
                    <Input onChange={(e) => setPlayerName(e.target.value)} value={playerName} placeholder="Player 1" style={style.input} prefix={<UserOutlined />} />
                    <Button onClick={() => addPlayer()} type="primary" danger ghost>Add</Button>
                </Card>

                <List
                    style={style.list}
                    size="small"
                    header={<div>Players :</div>}
                    bordered
                    dataSource={names}
                    renderItem={(item, i) => <List.Item>Player {i + 1} - {item}</List.Item>}
                />

                <Button onClick={() => buttonClick()} type="danger" size={'large'}>
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