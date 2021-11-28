/* 
 * Matthias Lechien
 *
 * last Update 26-11-21
 * 
 */

import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Card, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';


// classic login / sign up page
export default function LoginPage () {

    const dispatch = useDispatch();

    const [emailLogin, setEmailLogin] = useState('');
    const [emailSignIn, setEmailSignIn] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [passwordSignIn, setPasswordSignIn] = useState('');
    const [nameSignIn, setNameSignIn] = useState('');
    const [verified, setVerified] = useState(false);

    const signIn = async () => {
        const request = await fetch('/signin', {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `name=${nameSignIn}&email=${emailSignIn}&password=${passwordSignIn}`,
        })
        const result = await request.json();
        if(result.message){
            setVerified(true); 
            dispatch({type: 'adduser', token: result.user.token});
        } 
        setEmailSignIn('')
        setNameSignIn('')
        setPasswordSignIn('')
    }

    const login = async () => {
        const request = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `email=${emailLogin}&password=${passwordLogin}`,
        })
        const result = await request.json();
        if(result.message){
            setVerified(true);
            dispatch({type: 'adduser', token: result.user.token})
        }
        setEmailLogin('');
        setPasswordLogin('');
    }
    
    if(verified){
        return <Redirect to="/Account"/>
    }
    return(
        <div style={style.container}>
            <h1>Yams Game</h1>
            <div>
                {/* login */}
                <Card size="small" title="Login" style={{ width: 300, textAlign: 'center' }}>
                    <Input onChange={(e) => setEmailLogin(e.target.value)} value={emailLogin} placeholder="John.doe@gmail.com" style={style.input} prefix={<UserOutlined />} />
                    <Input.Password onChange={(e) => setPasswordLogin(e.target.value)} value={passwordLogin} placeholder="*******" style={style.input} prefix={<UserOutlined />} />
                    <Button onClick={() => login()} size="small" type="primary" danger ghost>Login</Button>
                </Card>
                
                {/* sign in */}
                <Card size="small" title="Sign In" style={{ width: 300, textAlign: 'center' }}>
                    <Input onChange={(e) => setNameSignIn(e.target.value)} value={nameSignIn} placeholder="John" style={style.input} prefix={<UserOutlined />} />
                    <Input onChange={(e) => setEmailSignIn(e.target.value)} value={emailSignIn} placeholder="John.doe@gmail.com" style={style.input} prefix={<UserOutlined />} />
                    <Input.Password onChange={(e) => setPasswordSignIn(e.target.value)} value={passwordSignIn} placeholder="*******" style={style.input} prefix={<UserOutlined />} />
                    <Button onClick={() => signIn()} size="small" type="primary" danger ghost>Sign In</Button>
                </Card>
            </div>
        </div>
    )
}

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    },
    flex: {
        display: 'flex',
    },
    input: {
        width: '200px',
        margin: '10px',
    }
}