import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';
import VisitProsumer from './visitProsumer';

class ManageUsers extends Component {
    state = {
        prosumers: [],
        consumers: [],
        display: false,
        displayProsumer: null,
    };

    constructor(props){
        super(props);
        this.fetchId = 0;
    }
    static contextType = AuthContext;
    
    componentDidMount(){
        this.mounted = true;
        this.fetchProsumers();
        this.fetchConsumers();
        this.updateValues();
    }

    componentWillUnmount(){
        clearInterval(this.fetchId);
        this.mounted = false;
    }

    updateValues = ()=>{
        this.fetchId = setInterval(() =>{
            this.fetchProsumers();
            this.fetchConsumers();
         },3000);
    }

    fetchProsumers = () => {
        let requestBody = {
            query: `
            {
                getProsumers {
                  _id
                  username
                  buffer
                  wind
                  consumption
                  consumed_from_grid
                  production
                  ratio_excess
                  ratio_under
                  blackout
                  online
                  img_path
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
            const prosumers = resData.data.getProsumers;
            for(var index in prosumers){
                if(prosumers[index].online){
                    prosumers[index].online = 'online'
                }else{prosumers[index].online = 'offline' }
            }
            this.setState({prosumers: prosumers});
            })
            .catch(err => {
            console.log(err);
        });
    }
    fetchConsumers = () => {
        let requestBody = {
            query: `
            {
                getConsumers {
                  _id
                  consumption
                  blackout
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
            const consumers = resData.data.getConsumers;
            this.setState({consumers: consumers});
            })
        .catch(err => {
            console.log(err);
        });
    }

    visitHandler = (p) =>{ 
        if(!this.state.display && this.state.displayProsumer===null){
            this.setState({displayProsumer: p})
            this.setState(prevState => {
                return { display: !prevState.display };
            });
        }
        else if(this.state.display && this.state.displayProsumer.username !== p.username){
            this.setState({displayProsumer:p})
        }
        else if(this.state.display && this.state.displayProsumer.username === p.username){
            this.setState({displayProsumer: null})
            this.setState(prevState => {
                return { display: !prevState.display };
            });
        } 
    }
    
    blockHandler = (id, under, excess, blackout) =>{
        if(blackout){
            //can't block prosumer during blackout
            return
        }
        document.getElementById(id).classList.add("bg-warning");
        let blockTime = (Math.random() * (101 - 10) + 10)*1000;
        let ratio_under = under;
        let ratio_excess = excess

        let requestBody = { //ratio_under should maybe be 100?
            query: `
            mutation{
                updateProsumer(_id:"${id}",ratio_under:0, ratio_excess:0){
                  ratio_excess
                  ratio_under
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

        requestBody = {
            query: `
            mutation{
                updateProsumer(_id:"${id}",ratio_under:${ratio_under}, ratio_excess:${ratio_excess}){
                  ratio_excess
                  ratio_under
                }
              }
                `
        }
        setTimeout( () =>{
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
            .then(()=>{
                if(document.getElementById(id)!== null){
                    document.getElementById(id).classList.remove("bg-warning");
                }
            })
        }, blockTime);
    }

    removeHandler = (id) =>{
        let requestBody = {
            query: `
            mutation{
                deleteProsumer(_id:"${id}")
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
        .then(() =>{
            this.fetchProsumers();
        })
    }
    removeConsumerHandler = (id) => {
        let requestBody = {
            query: `
            mutation{
                deleteConsumer(_id:"${id}")
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
        .then(() =>{
            this.fetchConsumers();
        })
    }
    addConsumerHandler = () => {
        let requestBody = {
            query: `
            mutation{
                insertConsumer{
                    blackout
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
        .then(() =>{
            this.fetchConsumers();
        })
    }
//this.state.status!=='stopped' ?"btn btn-danger" :"btn btn-success"

    render(){
        const prosumersList = this.state.prosumers.map(prosumer => {
            return (
              <tr key={prosumer._id} id={prosumer._id} className={prosumer.blackout?"bg-dark":""}>
                <td className={prosumer.blackout?"text-white":""}>{prosumer.username}</td>
                <td className={prosumer.blackout?"text-white":""}>{prosumer.online}</td>
                <td className={prosumer.blackout?"text-white":""}>{prosumer.blackout?"True":"False"}</td>
                <td><button className = "btn btn-success" type="submit" onClick={() => {this.visitHandler(prosumer)}}>Visit</button></td>
                <td>
                    <button className = {prosumer.blackout?"btn btn-warning":"btn btn-dark"} type="submit" disabled={prosumer.blackout?true:false}
                        onClick={() => {this.blockHandler(prosumer._id, prosumer.ratio_under, prosumer.ratio_excess, prosumer.blackout)}}>Block
                    </button>
                </td>
                <td><button className = "btn btn-danger" type="submit" onClick={() => {this.removeHandler(prosumer._id)}}>Remove</button></td>
              </tr>
            );
          });
        const consumersList = this.state.consumers.map((consumer, index) => {
            return(
                <tr key={consumer._id} id={consumer._id} className={consumer.blackout?"bg-dark":""}>
                    <td className={consumer.blackout?"text-white":""}>{index}</td>
                    <td className={consumer.blackout?"text-white":""}>{consumer.consumption}</td>
                    <td className={consumer.blackout?"text-white":""}>{consumer.blackout?"True":"False"}</td>
                    <td><button className = "btn btn-danger" type="submit" onClick={() => {this.removeConsumerHandler(consumer._id)}}>Remove</button></td>
                </tr>
            );
        })
        return(
            <div className="display-data-container">
                <h1>Manage Users</h1>
                <h3>Prosumers</h3>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Status</th>
                            <th scope="col">Blackout</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {prosumersList}
                    </tbody>
                </table>
                {this.state.display && (
                <VisitProsumer
                p = {this.state.displayProsumer}
                />)}
                <h3>Consumers</h3>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Consumption</th>
                            <th scope="col">Blackout</th>
                            <th scope="col"><button className = "btn btn-success" type="submit" onClick={() => {this.addConsumerHandler()}}>Add consumer</button></th>
                        </tr>
                    </thead>
                    <tbody>
                    {consumersList}
                    </tbody>
                </table>
            </div>
        );
    }
    
}

export default ManageUsers;
