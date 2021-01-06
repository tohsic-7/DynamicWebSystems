import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';
import VisitProsumer from './visitProsumer';

class ManageUsers extends Component {
    state = {
        prosumers: [],
        display: false,
        displayProsumer: null,
    };
    static contextType = AuthContext;
    
    componentDidMount(){
        this.mounted = true;
        this.fetchProsumers();
        this.updateValues();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    updateValues = ()=>{
        setInterval(() =>{
            this.fetchProsumers()
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
        .then(() =>{
            this.fetchProsumers();
        })
    }
//this.state.status!=='stopped' ?"btn btn-danger" :"btn btn-success"

    render(){
        const prosumersList = this.state.prosumers.map(prosumer => {
            return (
              <tr key={prosumer._id} id={prosumer._id} className={prosumer.blackout?"bg-dark":""}>
                <td>{prosumer.username}</td>
                <td>{prosumer.online}</td>
                <td>{prosumer.blackout}</td>
                <td><button className = "btn btn-success" type="submit" onClick={() => {this.visitHandler(prosumer)}}>Visit</button></td>
                <td><button className = "btn btn-dark" type="submit" onClick={() => {this.blockHandler(prosumer._id, prosumer.ratio_under, prosumer.ratio_excess, prosumer.blackout)}}>Block</button></td>
                <td><button className = "btn btn-danger" type="submit" onClick={() => {this.removeHandler(prosumer._id)}}>Remove</button></td>
            </tr>
            );
          });
        return(
            <div className="display-data-container">
                <h1>Manage Users</h1>
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
            </div>
        );
    }
    
}

export default ManageUsers;
