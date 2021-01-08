
const jwt = require("jsonwebtoken");

module.exports ={
    authProsumer,
    authManager
}

function authProsumer(token){
    if(!token){
      return false;
    }
    try{
        var decoded = jwt.verify(JSON.parse(token), 'somesupersecretkey');
        if(decoded.userType === 0){
            return true;
        }
        else{
            return false;
        }
    }
    catch(err){
        return false;
    }
  };

function authManager(token){
    if(!token){
      return false;
    }
    try{
        var decoded = jwt.verify(JSON.parse(token), 'somesupersecretkey');
        if(decoded.userType === 1){
            return true;
        }
        else{
            console.log("wrong user type");
            return false;
        }
    }
    catch(err){
        console.log(err);
        return false;
    }
  };