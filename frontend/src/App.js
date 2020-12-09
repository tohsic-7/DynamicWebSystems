import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthContext from './context/auth-context'

import AuthPage from './pages/auth';
import ProsumerPage from './pages/prosumer';
import ManagerPage from './pages/manager';
import './App.css';

class App extends Component {
  state = {
    userId: null,
    userType: null,
    token: null
  };

  login = (userId, userType, token, tokenExpiration) => {
    this.setState({
      userId: userId,
      userType: userType,
      token: token
    });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };


  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value = {
            {
            userId: this.state.userId,
            userType: this.state.userType,
            token: this.state.token,
            login: this.login,
            logout: this.logout
            }
          }
        >
          <Switch>
            {!this.state.token && <Redirect from="/" to="/auth" exact/>}
            {this.state.userType === 0 && <Redirect from="/auth" to="/prosumer" exact/>}
            {this.state.userType === 1 && <Redirect from="/auth" to="/manager" exact/>}
            {!this.state.token &&<Route path="/auth" component={AuthPage} />}
            {this.state.userType === 0 && <Route path="/prosumer" component={ProsumerPage} />}
            {this.state.userType === 1 && <Route path="/manager" component={ManagerPage} />}
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}


export default App;
