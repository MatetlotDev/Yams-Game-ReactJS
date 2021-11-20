import React, { useState, useEffect } from 'react';
import Homepage from './components/homepage';
import Game from './components/game';

import { BrowserRouter, Switch, Route } from 'react-router-dom';



export default function App() {

  return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Homepage} />
          <Route path='/game' component={Game} />
        </Switch>
      </BrowserRouter>
  )
}




