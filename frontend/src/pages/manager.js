import React, { Component } from 'react';
import authContext from '../context/auth-context';

class ManagerPage extends Component {
    state = {
        wind: 0,
        consumption: 0
    };


    constructor(props) {
        super(props);
        console.log(authContext.token);
        this.updateValues();
        }

    
    updateValues = () => {
        setInterval(() =>{
            let requestBody = {
                query: `
                {
                    getOneProsumer(_id:"5fcf625d07a7dfb32bc0a194"){
                        wind
                        consumption
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
                this.setState({wind: resData.data.getOneProsumer.wind});
                this.setState({consumption: resData.data.getOneProsumer.consumption});
                })
                .catch(err => {
                console.log(err);
            });
        },3000);
    }

    render(){
        return(
            <div>
                <h1>MANAGER PAGE</h1>
                <ul>
                    <li>{this.state.wind}</li>
                    <li>{this.state.consumption}</li>
                </ul>
            </div>
        );
    }
}

export default ManagerPage;