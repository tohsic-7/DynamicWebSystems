import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthContext from './context/auth-context'
import MainNavigation from '../src/components/Navigation/mainNavigation'

import AuthPage from './pages/auth';
import ProsumerPage from './pages/prosumer';
import ManagerPage from './pages/manager';
import ProsumerControlPage from './pages/prosumer_control'
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
    this.setState({ userId: null, userType:null, token:null});
  };


  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value = {{
              userId: this.state.userId,
              userType: this.state.userType,
              token: this.state.token,
              login: this.login,
              logout: this.logout
              }}
          >
            <MainNavigation />
            <Switch>
              {this.state.userType === 0 && <Redirect from="/auth" to="/prosumer" exact/>}
              {this.state.userType === 1 && <Redirect from="/auth" to="/manager" exact/>}
              {!this.state.token &&<Route path="/auth" component={AuthPage} />}
              {this.state.userType === 0 && <Route path="/prosumer" component={ProsumerPage} />}
              {this.state.userType === 0 && <Route path="/prosumer_controls" component={ProsumerControlPage} />}
              {this.state.userType === 1 && <Route path="/manager" component={ManagerPage} />}
              {!this.state.token && <Redirect to="/auth" exact/>}
            </Switch>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}


export default App;
