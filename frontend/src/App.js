import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthContext from './context/auth-context'
import MainNavigation from '../src/components/Navigation/mainNavigation'

import AuthPage from './pages/auth';
import ProsumerPage from './pages/prosumer';
import ManagerPage from './pages/manager';
import ManageUsers from './pages/Manager/manageUsers'
import ManageProfile from './pages/Manager/manageProfile'

import ProsumerControlPage from './pages/prosumer_control'
import './App.css';

class App extends Component {
  state = {
    userId: localStorage.getItem('uid'),
    userType: parseInt(localStorage.getItem('userType')),
    token: localStorage.getItem('token')
  };

  login = (userId, userType, token, tokenExpiration) => {
    this.setState({
      userId: userId,
      userType: userType,
      token: token
    });
    localStorage.setItem('uid', this.state.userId);
    localStorage.setItem('userType', this.state.userType);
    localStorage.setItem('token', JSON.stringify(this.state.token));
  };

  logout = () => {
    this.setState({ userId: null, userType:null, token:null});
    localStorage.removeItem('uid');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
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
              {this.state.userType === 1 && <Route exact strict path="/manage/users" component={ManageUsers} />}
              {this.state.userType === 1 && <Route exact strict path="/manage/profile" component={ManageProfile} />}
              {this.state.userType === 0 && <Redirect from="/auth" to="/prosumer" exact/>}
              {this.state.userType === 1 && <Redirect from="/auth" to="/manager" exact/>}
              {!this.state.token &&<Route path="/auth" component={AuthPage} />}
              {this.state.userType === 0 && <Route path="/prosumer" component={ProsumerPage} />}
              {this.state.userType === 0 && <Route path="/prosumer_controls" component={ProsumerControlPage} />}
              {this.state.userType === 1 && <Route path="/manager" component={ManagerPage} />}
              
              {!this.state.token && <Redirect to="/auth" exact />}
            </Switch>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}


export default App;
