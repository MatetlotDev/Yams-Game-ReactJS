/* 
 * Matthias Lechien
 *
 * last Update 26-11-21
 * 
 */

import React  from 'react';
import NewGame from './components/NewGame';
import LoginPage from './components/LoginPage';
import Account from './components/Account';
import Game from './components/game';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import token from './reducers/token.reducer';
import gamename from './reducers/gamename.reducer';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

const store = createStore(combineReducers({ token, gamename }));

export default function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={LoginPage} />
          <Route path='/Account' component={Account} />
          <Route path='/NewGame' component={NewGame} />
          <Route path='/game' component={Game} />
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}




