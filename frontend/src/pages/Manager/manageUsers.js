import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';

class ManageUsers extends Component {
    state = {
        prosumers: []
    };
    static contextType = AuthContext;

    componentDidMount(){
        this.fetchProsumers();
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

    render(){
        const prosumersList = this.state.prosumers.map(prosumer => {
            console.log(prosumer);
            return (
              <tr key={prosumer._id}>
                <td>{prosumer.username}</td>
                <td>{prosumer.online}</td>
                <td><button className = "btn btn-success" type="submit">Visit</button></td>
                <td><button className = "btn btn-dark" type="submit">Block</button></td>
                <td><button className = "btn btn-danger" type="submit">Remove</button></td>
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
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                {prosumersList}
                </tbody>
                </table>
            </div>
        );
    }
    
}

export default ManageUsers;
