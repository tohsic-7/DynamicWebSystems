import React, {Component} from 'react'
import './credentialsModal.css'
class CredentialsModal extends Component{
    constructor(props){
        super(props);
        this.usernameEl = React.createRef();
        this.passwordEl = React.createRef();
        this.confirmPasswordEl = React.createRef();
    }

    credentialsHandler = event => {
        const username = this.usernameEl.current.value;
        const password = this.passwordEl.current.value;
        const confirmPassword = this.confirmPasswordEl.current.value;

        if(password !== confirmPassword && password.trim().length > 0 && confirmPassword.trim().length > 0){
            document.getElementById("confirmPasswordHelper").style.display = "block";
            event.preventDefault();
            return
        }
        let requestBody = {
            query: `mutation{
                    adminUpdateProsumerCredentials(_id:"${this.props.p._id}",username:"${username}", password:"${password}"){
                        username
                        password
                    }
                }`
        };
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
        .then( resData=>{
            let error;
            if(resData.errors !== undefined){
                error = resData.errors[0].message;
            }
            if(error === "UsernameTaken"){
                document.getElementById("usernameHelper").style.display = "block";
                return
            }
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            document.getElementById("confirmPassword").value = "";

            document.getElementById("usernameHelper").style.display = "none";
            document.getElementById("confirmPasswordHelper").style.display = "none";
        })
        .catch(err => {
            console.log(err);
        });
    }

    render(){
        return(
            <React.Fragment>
                <div className="modall" tabIndex={-1}>
                    <header className="modal__header">
                        <h1>Update {this.props.p.username}'s credentials</h1>
                    </header>
                    <section className="modal__content">
                        <form>
                            <div className="form-group">
                                <label htmlFor="username" >New username</label>
                                <input type="username" id="username" className="form-control" placeholder="Update username" ref={this.usernameEl} />
                                <span id="usernameHelper" className="help-inline text-danger" style={{display: 'none'}}>The username you have chosen is already taken</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">New password</label>
                                <input type="password" id="password" className="form-control" placeholder="Update password" ref={this.passwordEl} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Please confirm the new password</label>
                                <input type="password" id="confirmPassword" className="form-control" placeholder="Please confirm password" ref={this.confirmPasswordEl} />
                                <span id="confirmPasswordHelper" className="help-inline text-danger" style={{display: 'none'}}>The new password could not be confirmed</span>
                            </div>
                        </form>
                    </section>
                    <section className="modal__actions">
                        <button className="btn btn-danger" type="submit" style={{marginRight: 10 + 'px'}} onClick={this.props.onCancel}>
                            Cancel
                        </button>
                        <button className="btn btn-primary"type="submit" onClick={this.credentialsHandler}>
                            Update
                        </button>
                    </section>
                </div>
            </React.Fragment>
        )
    }
}
export default CredentialsModal;