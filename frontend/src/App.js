import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthContext from './context/auth-context'
import MainNavigation from '../src/components/Navigation/mainNavigation'

import AuthPage from './pages/auth';
import ProsumerPage from './pages/prosumer';
import ManagerPage from './pages/manager';
import ManageUsers from './pages/Manager/manageUsers'
import ManageProfile from './pages/Manager/manageProfile'
import ProsumerRoute from './routing/ProsumerRoute';
import ManagerRoute from './routing/ManagerRoute';

import ProsumerControlPage from './pages/prosumer_control'
import './App.css';

const jwt = require("jsonwebtoken");

class App extends Component {
  state = {
    userId: null,
    userType: null,
    token: localStorage.getItem('token')
  };

  constructor(props){
    super(props);
    console.log(this.state.token);
    var token = localStorage.getItem('token');
    try{
      if(token){
        var decoded = jwt.verify(JSON.parse(token), 'somesupersecretkey');
      }
      this.state = {
        userId: decoded.userId,
        userType: decoded.userType,
        token: token
      };
    } catch(error){
      console.log(error);
      if(error.name === "TokenExpiredError"){
        console.log("token");
        this.removeToken();
      }
      if(error.name === "JsonWebTokenError"){
        this.removeToken();
      }
    }
  }

  login = (userId, userType, token, tokenExpiration) => {
    console.log(token);
    this.setState({
      userId: userId,
      userType: userType,
      token: JSON.stringify(token)
    });
    localStorage.setItem('token', this.state.token);
  };

  logout = () => {
    this.setState({ userId: null, userType:null, token:null});
    this.removeToken();
  };

  removeToken(){
    localStorage.removeItem('token');
  }


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
              {<ManagerRoute exact token={this.state.token} path="/manage/users" component={ManageUsers} />}
              {<ManagerRoute exact token={this.state.token} path="/manage/profile" component={ManageProfile} />}
              {<ManagerRoute exact token={this.state.token}path="/manager" component={ManagerPage} />}
              {<ProsumerRoute exact token={this.state.token} path="/prosumer_controls" component={ProsumerControlPage} />}
              {<ProsumerRoute exact token={this.state.token} path="/prosumer" component={ProsumerPage} />}
              {this.state.userType === 0 && <Redirect from="/auth" to="/prosumer" exact />}
              {this.state.userType === 1 && <Redirect from="/auth" to="/manager" exact />}
              {<Route path="/auth" component={AuthPage} />}
              {!this.state.token && <Redirect to="/auth" exact />}
            </Switch>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}


export default App;
