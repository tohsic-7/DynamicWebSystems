import React, { Component } from 'react';
import CredentialsModal from './credentialsModal'
class VisitProsumer extends Component{
    state = {
        showModal: false
    };

    updateProsumerCredentials = () => {
        document.body.style.overflow = "hidden"; 
        document.body.style.height = "100%"; 
        this.setState({showModal: true});
    }

    closeModal = () => {
        document.body.style.overflow = "auto"; 
        document.body.style.height = "auto"; 
        this.setState({showModal: false});
    }

    render(){
        return(
            <React.Fragment>
                <h3 style={{padding: 10 + 'px'}}>Now viewing {this.props.p.username}'s system.</h3>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Current wind speed: 
                        <br/>{this.props.p.wind} m/s
                    </li>
                    <li className="list-group-item">Current production: 
                        <br/>{this.props.p.production} Wh
                    </li>
                    <li className="list-group-item">Current consumption: 
                        <br/>{this.props.p.consumption} Wh
                    </li>
                    <li className="list-group-item">Electricity in buffer: 
                        <br/>{this.props.p.buffer} Wh
                    </li>
                    <li className="list-group-item">
                        <button className = "btn btn-primary" style={{marginRight: 10 + 'px'}} type="submit" onClick={this.updateProsumerCredentials}>Update Credentials</button>
                    </li>
                </ul>
                {this.state.showModal && (<CredentialsModal 
                    p = {this.props.p}
                    onCancel={this.closeModal}
                />)}
            </React.Fragment>
        )
    }
}

export default VisitProsumer;
