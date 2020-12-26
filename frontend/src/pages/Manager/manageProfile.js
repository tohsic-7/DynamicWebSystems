import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';

class ManageProfile extends Component {
    state = {
        status: '',
        production: 0,
        ratio: 0,
        demand: 0,
        price: 0
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
            let prosumers = resData.data.getProsumers;
            console.log(prosumers);
            })
            .catch(err => {
            console.log(err);
        });
    }

    render(){
        return(
            <div className="display-data-container">
                <h1>Manage Profile</h1>
            </div>
        );
    }
    
}

export default ManageProfile;