import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Green Lean Electrics</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {context.userType===1 && (
                <li>
                    <NavLink to="/manager">Manager</NavLink>
                </li>
              )}
              {context.userType===0 && (
                <li>
                    <NavLink to="/prosumer">Manager</NavLink>
                </li>
              )}
              {context.token && (
                <React.Fragment>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;