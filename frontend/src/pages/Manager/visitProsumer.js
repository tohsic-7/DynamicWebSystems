import React from 'react';

const VisitProsumer = props => (

    <React.Fragment>
    <h3 style={{padding: 10 + 'px'}}>Now viewing {props.p.username}'s system.</h3>
    <ul className="list-group list-group-flush">
        <li className="list-group-item">Current wind speed: 
            <br/>{props.p.wind} m/s
        </li>
        <li className="list-group-item">Current production: 
            <br/>{props.p.production} Wh
        </li>
        <li className="list-group-item">Current consumption: 
            <br/>{props.p.consumption} Wh
        </li>
        <li className="list-group-item">Electricity in buffer: 
            <br/>{props.p.buffer} Wh
        </li>
    </ul>
    </React.Fragment>
  );

export default VisitProsumer;
