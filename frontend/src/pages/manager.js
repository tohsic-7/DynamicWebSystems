import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

class ManagerPage extends Component {
    state = {
        status: '',
        production: 0,
        buffer: 0,
        ratio: 0,
        demand: 0,
        consumption:0,
        price: 0,
        modelled_price: 0,
        price_bool: false,
    };
    constructor(props){
        super(props);
        this.priceEl = React.createRef();
        this.priceBoolEl = React.createRef();
        this.fetchId = 0;
    }
    static contextType = AuthContext;

    componentDidMount(){
        this.mounted = true;
        this.fetchManagerData();
        this.fetchId = setTimeout(() =>{
            var check = document.getElementById("priceBool");
            check.checked = this.state.price_bool;
        },100)
        this.updateValues();
    }

    componentWillUnmount(){
        clearInterval(this.fetchId);
        this.mounted = false;
    }
    
    updateValues = () => {
        setInterval(() =>{
            this.fetchManagerData();
        },3000);
    }

    startStopHandler = () =>{
        let status = "starting";
        if(this.state.status === 'running' || this.state.status === 'starting'){
            status = "stopped";
        }
        let requestBody = {
            query: `
                mutation {
                    updateManager(_id:"${this.context.userId}", status:"${status}") {
                        status
                    }
                }
                `
        }
        fetch('https://localhost:4000/graphql', {
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
            this.setState({status: resData.data.updateManager.status});
        })
        .catch(err => {
        console.log(err);
        });
    }

    setPriceHandler = () => {
        const price_bool = document.getElementById("priceBool").checked;
        const price = document.getElementById("priceInt").value;
        let requestBody;
        if(price !== ''){
            requestBody = {
                query: `
                    mutation {
                        updateManager(_id:"${this.context.userId}", price:${price}, price_bool:${price_bool}) {
                            price_bool
                            price
                        }
                    }
                    `
            }
        }else{
            requestBody = {
                query: `
                    mutation {
                        updateManager(_id:"${this.context.userId}", price_bool:${price_bool}) {
                            price_bool
                            price
                        }
                    }
                    `
        }
    }
        fetch('https://localhost:4000/graphql', {
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
            this.setState({price: resData.data.updateManager.price});
            this.setState({price_bool: resData.data.updateManager.price_bool});
            this.fetchManagerData();
        })
        .catch(err => {
        console.log(err);
        });
    }

    fetchManagerData = () => {
        let requestBody = {
            query: `
            {
                getOneManager(_id:"${this.context.userId}"){
                    status
                    production
                    buffer
                    ratio
                    consumption
                    demand
                    price
                    modelled_price
                    price_bool
                }
            }
                `
        }
        fetch('https://localhost:4000/graphql', {
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
            this.setState({buffer: resData.data.getOneManager.buffer});
            this.setState({consumption: resData.data.getOneManager.consumption});
            this.setState({price: resData.data.getOneManager.price});
            this.setState({modelled_price: resData.data.getOneManager.modelled_price});
            this.setState({price_bool: resData.data.getOneManager.price_bool});
            })
            .catch(err => {
            console.log(err);
        });
    }

    render(){
        return(
            <div className="display-data-container">
                <h1>MANAGER PAGE</h1>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Status:     {this.state.status} 
                        <button onClick={this.startStopHandler} className = {this.state.status!=='stopped' ?"btn btn-danger" :"btn btn-success"} style={{float: 'right'}} type="button">
                            {this.state.status!=='stopped' ? 'Stop' : 'Start'}
                        </button>
                    </li>
                    <li className="list-group-item">Production:     {this.state.production}</li>
                    <li className="list-group-item">Consumption:     {this.state.consumption}</li>
                    <li className="list-group-item">Buffer:     {this.state.buffer}</li>
                    <li className="list-group-item">Ratio:     {this.state.ratio}</li>
                    <li className="list-group-item">Demand:     {this.state.demand}</li>
                    <li className="list-group-item">Modelled price:     {this.state.modelled_price}</li>
                    <li className="list-group-item">price:     {this.state.price}</li>
                    <li className="list-group-item">
                        <div className="form-actions">
                            <div className="text-input">
                                <input type="number" id="priceInt" placeholder="Change price" style={{marginRight: 10 + 'px'}}></input>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" ref={this.priceBoolEl} type="checkbox" id="priceBool" value="option1" defaultChecked={this.state.price_bool}></input>
                                    <label className="form-check-label" htmlFor="inlineCheckbox1">Set price equal to modelled price</label>
                                </div>
                                <br/><br/><button type="submit" className="btn btn-info" onClick={this.setPriceHandler} ref={this.priceEl}> Update price </button>
                            </div>
                            
                        </div>
                    </li>
                    
                </ul>
            </div>
        );
    }
    
}

export default ManagerPage;