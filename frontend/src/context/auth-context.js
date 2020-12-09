import React from 'react';

export default React.createContext({
    token: null,
    userType: null,
    userId: null,
    login: (userId, userType, token, tokenExpiration) => {},
    logout: () => {}
});