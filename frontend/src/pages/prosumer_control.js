import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import './prosumer.css'

class ProsumerControlPage extends Component {
    state = {
        username: "",
        ratio_excess: 0,
        ratio_under: 0,
        buffer_size: 0,
        excess_slider_value: 0,
        under_slider_value: 0,
        image_upload: false

    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.batteryEl = React.createRef();
        }

    componentDidMount(){
        this.mounted = true;
        this.fetchProsumerData();
    }

    componentWillUnmount(){
        this.mounted = false;
  }

    fetchProsumerData(){
        let requestBody = {
            query: `
            {
                getOneProsumer(_id:"${this.context.userId}"){
                    username
                    ratio_excess
                    ratio_under
                    buffer_size
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
            this.setState({username: resData.data.getOneProsumer.username});
            this.setState({ratio_excess: resData.data.getOneProsumer.ratio_excess});
            this.setState({excess_slider_value: resData.data.getOneProsumer.ratio_excess});
            this.setState({ratio_under: resData.data.getOneProsumer.ratio_under});
            this.setState({under_slider_value: resData.data.getOneProsumer.ratio_under});
            this.setState({buffer_size: resData.data.getOneProsumer.buffer_size});
            })
            .catch(err => {
            console.log(err);
        });
    }

    submitExcessHandler = event =>{

            let requestBody = {
                query: `
                    mutation {
                        updateProsumer(_id:"${this.context.userId}", ratio_excess:${this.state.excess_slider_value}) {
                            ratio_excess
                        }
                    }
                    `
            };



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
                    this.setState({ratio_excess: resData.data.updateProsumer.ratio_excess});
                    this.setState({excess_slider_value: resData.data.updateProsumer.ratio_excess});
            })
            .catch(err => {
                console.log(err);
            });
        }


    submitUnderHandler = event =>{
        let requestBody = {
            query: `
                mutation {
                    updateProsumer(_id:"${this.context.userId}", ratio_under:${this.state.under_slider_value}) {
                        ratio_under
                    }
                }
                `
        };



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
                this.setState({ratio_under: resData.data.updateProsumer.ratio_under});
                this.setState({under_slider_value: resData.data.updateProsumer.ratio_under});
        })
        .catch(err => {
            console.log(err);
        });
    }

    submitBatteryHandler = event =>{
        const battery = document.getElementById("batteryInt").value;
        let requestBody = {
            query: `
                mutation {
                    updateProsumer(_id:"${this.context.userId}", buffer_size:${battery}) {
                        buffer_size
                    }
                }
                `
        };



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
            this.setState({buffer_size: resData.data.updateProsumer.buffer_size});
        })
        .catch(err => {
            console.log(err);
        });
    }

    submitImageHandler(image_path){
        const battery = document.getElementById("batteryInt").value;
        console.log(battery);
        let requestBody = {
            query: `
                mutation {
                    updateProsumer(_id:"${this.context.userId}", img_path:${image_path}) {
                        buffer_size
                    }
                }
                `
        };



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
                this.setState({buffer_size: resData.data.updateProsumer.buffer_size});
        })
        .catch(err => {
            console.log(err);
        });
    }



    updateUnderValue() {
        var slider = document.getElementById("underRange");

        this.setState({under_slider_value: slider.value});
    }

    updateExcessValue() {
        var slider = document.getElementById("excessRange");

        this.setState({excess_slider_value: slider.value});
    }

    image_uploader_bool(){
        if(!this.state.image_upload){
            this.setState({image_upload: true});
        }else {
            this.setState({image_upload: false});
        }
    }

    image_uploader(){
        const fs = require("fs");
        var file = document.getElementById("file_input").files;
        console.log(file[0]);
        fs.copyFile(file[0], '/images/prosumers');
    }

    render(){
        return(
        <div className="display-data">
            <div className="display-data-container">
                <h1>Prosumer control</h1>
                <h5>Hello {this.state.username}! Here you can control your settings</h5>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <label className="form-label" htmlFor="excessRange">If excess production {this.state.ratio_excess}% goes to the battery</label>
                            <div className="range">
                                <input type="range" className="form-range" id="excessRange" value={this.state.excess_slider_value} onInput={this.updateExcessValue.bind(this)}/>
                                <br></br><button type="submit" className="btn btn-info" onClick={this.submitExcessHandler}> Update ratio to {this.state.excess_slider_value}% </button>
                            </div>
                    </li>
                    <li className="list-group-item">
                            <label className="form-label" htmlFor="underRange">If under production {this.state.ratio_under}% is taken from the battery</label>
                            <div className="range">
                                <input type="range" className="form-range" id="underRange" value={this.state.under_slider_value} onInput={this.updateUnderValue.bind(this)}/>
                                <br></br><button type="submit" className="btn btn-info" onClick={this.submitUnderHandler}> Update ratio to {this.state.under_slider_value}% </button>
                            </div>
                    </li>

                    <li className="list-group-item">Your current battery size is: {this.state.buffer_size} Wh
                        <div className="text-input">
                            <input type="number" id="batteryInt" placeholder="Change battery size"></input>
                            <br/><br/><button type="submit" className="btn btn-info" onClick={this.submitBatteryHandler} ref={this.batteryEl}> Update battery size </button>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="display-data-container">
               <img className="img-house" src='./images/prosumers/hej.jpeg' alt="heeeeeej" />
                <br/>
                {!this.state.image_upload && <button className="btn btn-info" id="house-button" onClick={this.image_uploader_bool.bind(this)}> Change house image</button>}
                {this.state.image_upload && <div>
                    <input type="file" id="file_input" accept="image/*"/>
                    <br/>
                    <br/>
                    <button className="btn btn-danger" id="house-button" onClick={this.image_uploader_bool.bind(this)}> Cancel</button>
                    <button type="submit" className="btn btn-success" id="house-button" onClick={this.image_uploader.bind(this)}> Change house image</button>
                </div>}
            </div>
        </div>
        )
    }
}
export default ProsumerControlPage;