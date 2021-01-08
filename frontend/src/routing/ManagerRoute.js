import React from 'react';
import { Route, Redirect } from 'react-router-dom';

var utils = require('../utils');

const ManagerRoute = ({ component, token, ...rest }) => {
    return (
      <Route
        {...rest}
        exact
        render={props =>
          utils.authManager(token) ? (
            <div>{React.createElement(component, props)}</div>
          ) : (
            <Redirect
              to="/auth"
            />
          )
        }
      />
    );
  };


export default ManagerRoute;