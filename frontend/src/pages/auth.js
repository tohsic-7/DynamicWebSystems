import React, { Component } from 'react';

import AuthContext from '../context/auth-context';

/**
 * TODO:
 * clearify that you can't sign up as manager (make role selection invisible)
 * fix buttons
 * face lift as you see fit
 * make sure that when logged in, online variable is set to true in db
 */

class AuthPage extends Component {
    state = {
        isLogin: true
    };

    static contextType = AuthContext;

    constructor(props) {
    super(props);
    this.usernameEl = React.createRef();
    this.passwordEl = React.createRef();
    this.role = React.createRef();
    }
    
    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin };
        });
    };

    submitHandler = event => {
        event.preventDefault();
        const username = this.usernameEl.current.value;
        const password = this.passwordEl.current.value;
        const user = this.role.current.value;

        if (username.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: ''
        };

        if (!this.state.isLogin) {
            requestBody = {
            query: `
                mutation {
                    insertProsumer(username: "${username}", password: "${password}") {
                        _id
                        username
                    }
            }
            `
            };
        }

        else if(this.state.isLogin && user === 'Manager'){
            requestBody = {
                query: `
                    mutation {
                        loginManager(username: "${username}", password: "${password}") {
                            userId
                            userType
                            token
                            tokenExpiration
                        }
                    }
                    `
            }
            fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
            'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                if(resData.data.loginManager.token){
                    this.context.login(
                        resData.data.loginManager.userId,
                        resData.data.loginManager.userType,
                        resData.data.loginManager.token,
                        resData.data.loginManager.tokenExpiration
                    );
                }
                })
                .catch(err => {
                console.log(err);
            });
        }

        else if(this.state.isLogin && user === 'Prosumer'){
            requestBody = {
                query: `
                    mutation {
                        loginProsumer(username: "${username}", password: "${password}") {
                            userId
                            userType
                            token
                            tokenExpiration
                        }
                    }
                    `
            }
            fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
            'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                if(resData.data.loginProsumer.token){
                    this.context.login(
                        resData.data.loginProsumer.userId,
                        resData.data.loginProsumer.userType,
                        resData.data.loginProsumer.token,
                        resData.data.loginProsumer.tokenExpiration
                    );
                }
                })
                .catch(err => {
                console.log(err);
            });
        }
    };

  render() {
    return (
        <div className="auth-container col-12">
            <div className="form-container col-6">
                <h3>Please enter your credentials</h3>

                <form onSubmit={this.submitHandler}>
                <div className="form-group">
                    <label htmlFor="username" >Username</label>
                    <input type="username" id="username" className="form-control" placeholder="Enter username" ref={this.usernameEl} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" className="form-control" placeholder="Password" ref={this.passwordEl} />
                </div>
                <div className="form-group">
                    <label htmlFor="user" >Select your role</label>
                    <select className="form-control" ref={this.role}>
                        <option>Prosumer</option>
                        <option>Manager</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button className = "btn btn-primary" style={{marginRight: 10 + 'px'}} type="submit">Submit</button>
                    <button className = "btn btn-primary" type="button" onClick={this.switchModeHandler}>
                    Switch to {this.state.isLogin ? 'Signup' : 'Login'}
                    </button>
                </div>
                </form>
            </div>
        </div>
      );
  }
}

export default AuthPage;