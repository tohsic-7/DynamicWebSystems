import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

class ManagerPage extends Component {
    state = {
        status: '',
        production: 0,
        ratio: 0,
        demand: 0,
        price: 0
    };
    static contextType = AuthContext;

    componentDidMount(){
        this.updateValues();
    }
    
    updateValues = () => {
        setInterval(() =>{
            let requestBody = {
                query: `
                {
                    getOneManager(_id:"${this.context.userId}"){
                        status
                        production
                        ratio
                        demand
                        price
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
                this.setState({status: resData.data.getOneManager.status});
                this.setState({production: resData.data.getOneManager.production});
                this.setState({ratio: resData.data.getOneManager.ratio});
                this.setState({demand: resData.data.getOneManager.demand});
                this.setState({price: resData.data.getOneManager.price});
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
                    <li>status:     {this.state.status}</li>
                    <li>production:     {this.state.production}</li>
                    <li>ratio:     {this.state.ratio}</li>
                    <li>demand:     {this.state.demand}</li>
                    <li>price:     {this.state.price}</li>
                </ul>
            </div>
        );
    }
    
}

export default ManagerPage;