import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';

class ManageProfile extends Component {
    state = {
        ratio: 0,
        ratio_slider_value: 0,
        buffer_size:0,
        username: ''
    };
    constructor(props) {
        super(props);
        this.batteryEl = React.createRef();
        this.usernameEl = React.createRef();
        this.oldPasswordEl = React.createRef();
        this.passwordEl = React.createRef();
        this.confirmPasswordEl = React.createRef();
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.fetchManager();
    }

    fetchManager = () => {
        let requestBody = {
            query: `
            {
                getOneManager(_id:"${this.context.userId}"){
                _id
                username
                buffer
                buffer_size
                consumption
                production
                status
                ratio
                demand
                price
                img_path
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
            const manager = resData.data.getOneManager;
            this.setState({buffer_size: manager.buffer_size});
            this.setState({ratio: manager.ratio});
            this.setState({ratio_slider_value: manager.ratio});
            this.setState({username: manager.username});
            })
            .catch(err => {
            console.log(err);
        });
    }

    submitBatteryHandler = event =>{
        const battery = document.getElementById("batteryInt").value;
        let requestBody = {
            query: `
                mutation {
                    updateManager(_id:"${this.context.userId}", buffer_size:${battery}) {
                        buffer_size
                    }
                }
                `
        };



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
            this.setState({buffer_size: resData.data.updateManager.buffer_size});
        })
        .catch(err => {
            console.log(err);
        });
    }

    submitRatioHandler = () =>{
        console.log(this.context.userId);
        console.log(this.state.ratio_slider_value);
        let requestBody = {
            query: `
                mutation {
                    updateManager(_id:"${this.context.userId}", ratio:${this.state.ratio_slider_value}) {
                        ratio
                    }
                }
                `
        };
        fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
        'Content-Type': 'application/json'
        }
    })
        .then(res => {
            console.log(res);
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
                this.setState({ratio: resData.data.updateManager.ratio});
                this.setState({ratio_slider_value: resData.data.updateManager.ratio});
        })
        .catch(err => {
            console.log(err);
        });
    }

    updateRatioValue() {
        var slider = document.getElementById("ratioRange");

        this.setState({ratio_slider_value: slider.value});
    }

    credentialsHandler = event => {
        const username = this.usernameEl.current.value;
        const oldPassword = this.oldPasswordEl.current.value;
        const password = this.passwordEl.current.value;
        const confirmPassword = this.confirmPasswordEl.current.value;

        if(password !== confirmPassword){
            //visualize passwords don't match
        }
        let requestBody = {
            query: `mutation{
                        updateManagerCredentials(_id:"${this.context.userId}",username:"${username}", password:"${password}. oldPassword:${oldPassword}"){
                        username
                        password
                    }
                }`
        };
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res);
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
        
    }

    render(){
        return(
            <div className="display-data">
                <div className="display-data-container">
                    <h1>Manager control</h1>
                    <h5>Hello {this.state.username}! Here you can control your settings</h5>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <label className="form-label" htmlFor="ratioRange">During production {this.state.ratio_slider_value}% goes to the battery</label>
                                <div className="range">
                                    <input type="range" className="form-range" id="ratioRange" onInput={this.updateRatioValue.bind(this)} value={this.state.ratio_slider_value} />
                                    <br></br><button type="submit" className="btn btn-info" onClick={this.submitRatioHandler}> Update ratio to {this.state.ratio_slider_value}% </button>
                                </div>
                        </li>

                        <li className="list-group-item">Your current battery size is: {this.state.buffer_size} Wh
                            <div className="text-input">
                                <input type="number" id="batteryInt" placeholder="Change battery size"></input>
                                <br/><br/><button type="submit" className="btn btn-info" onClick={this.submitBatteryHandler} ref={this.batteryEl}> Update battery size </button>
                            </div>
                        </li>
                    </ul>
                    <br></br>
                    <form onSubmit={this.credentialsHandler}>
                        <div className="form-group">
                            <label htmlFor="username" >Username</label>
                            <input type="username" id="username" className="form-control" placeholder="Update username" ref={this.usernameEl} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" className="form-control" placeholder="Update password" ref={this.oldPasswordEl} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" className="form-control" placeholder="Update password" ref={this.passwordEl} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Password</label>
                            <input type="password" id="confirmPassword" className="form-control" placeholder="Please confirm password" ref={this.confirmPasswordEl} />
                        </div>
                        <div className="form-actions">
                            <button className = "btn btn-primary" type="submit">Update credentials</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
    
}

export default ManageProfile;