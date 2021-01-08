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

  componentDidMount(){
    try{
      if(this.state.token){
        var decoded = jwt.verify(JSON.parse(this.state.token), 'somesupersecretkey');
        this.setState({userId: decoded.userId});
        this.setState({userType: decoded.userType});
      }
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
    console.log(this.state.token);
    console.log(this.state.userId);
    console.log(this.state.userType);
    console.log(decoded.userId);
    console.log(decoded.userType);

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
              {<ManagerRoute exact strict token={this.state.token} path="/manage/users" component={ManageUsers} />}
              {<ManagerRoute exact strict token={this.state.token} path="/manage/profile" component={ManageProfile} />}
              {<ManagerRoute exact token={this.state.token}path="/manager" component={ManagerPage} />}
              {<ProsumerRoute exact token={this.state.token} path="/prosumer_controls" component={ProsumerControlPage} />}
              {<ProsumerRoute exact token={this.state.token} path="/prosumer" component={ProsumerPage} />}
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
