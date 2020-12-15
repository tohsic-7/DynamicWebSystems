import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

class ProsumerPage extends Component {
    state = {
        wind: 0,
        production: 0,
        consumption: 0,
        net_production: 0,
        buffer: 0

    };

    static contextType = AuthContext;


    constructor(props) {
        super(props);
        }

    componentDidMount(){
        this.fetchProsumerData();
        this.updateValues();
    }


    updateValues = () => {
        setInterval(() =>{
           this.fetchProsumerData()
        },3000);
    }

    fetchProsumerData(){
        let requestBody = {
            query: `
            {
                getOneProsumer(_id:"${this.context.userId}"){
                    wind
                    production
                    consumption
                    buffer
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
            this.setState({production: resData.data.getOneProsumer.production});
            this.setState({consumption: resData.data.getOneProsumer.consumption});
            this.setState({net_production: (resData.data.getOneProsumer.production - resData.data.getOneProsumer.consumption)});
            this.setState({buffer: resData.data.getOneProsumer.buffer});
            })
            .catch(err => {
            console.log(err);
        });
    }

    render(){
        return(
            <div>
                <h1>Prosumer PAGE</h1>
                <ul>
                    <li>Current wind speed: {this.state.wind} m/s</li>
                    <li>Current production: {this.state.production} Wh</li>
                    <li>Current consumption: {this.state.consumption} Wh</li>
                    <li>Net production: {this.state.net_production} Wh</li>
                    <li>Electricity in buffer: {this.state.buffer} Wh</li>
                </ul>
            </div>
        );
    }
}
export default ProsumerPage;