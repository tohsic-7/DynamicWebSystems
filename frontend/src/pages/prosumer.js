import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

class ProsumerPage extends Component {
    state = {
        wind: 0,
        production: 0,
        consumption: 0,
        net_production: 0,
        buffer: 0,
        username: "",
        price: 0

    };

    static contextType = AuthContext;


    constructor(props) {
        super(props);
        this.fetchId = 0;
        }

    componentDidMount(){
        this.fetchProsumerData();
        this.updateValues();
    }

    componentWillUnmount(){
        clearInterval(this.fetchId);
    }


    updateValues = () => {
        this.fetchId = setInterval(() =>{
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
                    username
                    price
                }
            }
                `
        }
        fetch(process.env.REACT_APP_API_URL, {
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
            this.setState({wind: resData.data.getOneProsumer.wind.toFixed(2)});
            this.setState({production: resData.data.getOneProsumer.production.toFixed(2)});
            this.setState({consumption: resData.data.getOneProsumer.consumption.toFixed(2)});
            this.setState({net_production: (resData.data.getOneProsumer.production - resData.data.getOneProsumer.consumption).toFixed(2)});
            this.setState({buffer: resData.data.getOneProsumer.buffer.toFixed(2)});
            this.setState({username: resData.data.getOneProsumer.username});
            this.setState({price: resData.data.getOneProsumer.price.toFixed(3)});
            })
            .catch(err => {
            console.log(err);
        });
    }

    render(){
        return(
            <div className="display-data-container">
                <h1>Prosumer page</h1>
                <h5>Welcome {this.state.username}!</h5>

                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Current wind speed: 
                    <br/>{this.state.wind} m/s</li>
                    <li className="list-group-item">Current production: 
                    <br/>{this.state.production} Wh</li>
                    <li className="list-group-item">Current consumption: 
                    <br/>{this.state.consumption} Wh</li>
                    <li className="list-group-item">Net production:
                    <br/> {this.state.net_production} Wh</li>
                    <li className="list-group-item">Electricity in buffer: 
                    <br/>{this.state.buffer} Wh</li>
                    <li className="list-group-item">Electricity price: 
                    <br/>{this.state.price} kr</li>
                </ul>
            </div>
        );
    }
}
export default ProsumerPage;