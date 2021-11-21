import React, { useState, useEffect } from 'react';
import NewGame from './components/NewGame';
// import LoginPage from './components/LoginPage';
import Game from './components/game';

import { BrowserRouter, Switch, Route } from 'react-router-dom';



export default function App() {

  return (
      <BrowserRouter>
        <Switch>
          {/* <Route path='/' exact component={LoginPage}/> */}
          <Route path='/' exact component={NewGame} />
          <Route path='/game' component={Game} />
        </Switch>
      </BrowserRouter>
  )
}




