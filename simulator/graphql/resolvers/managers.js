const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { findOneAndUpdate } = require('../../../models/manager');

const Manager = require("../../../models/manager");
const Prosumer = require("../../../models/prosumer")


function getActiveAttributes(args){
    // Set all manager attributes regardless if they're null/undefined
    activeAttributes = {
        username: args.username,
        password: args.password,
        buffer: args.buffer,
        buffer_size: args.buffer_size,
        consumption: args.consumption,
        production: args.production,
        production_cap: args.production_cap,
        status: args.status,
        timer: args.timer,
        ratio: args.ratio,
        demand: args.demand,
        price: args.price,
        modelled_price: args.modelled_price,
        price_bool: args.price_bool,
        img_path: args.img_path
    }
    // Delete all attributes which are not set for this update
    // such that only the ones that are set remain
    for(var attribute in activeAttributes){
        if (activeAttributes[attribute] === null || activeAttributes[attribute] === undefined) {
            delete activeAttributes[attribute];
        }
    }

    return activeAttributes;
}

module.exports = {
    // Manager query resolvers
    getOneManager: async (args)=> {
        try {    
            manager = Manager.findOne({ _id: args._id })
            return manager;
        }catch(err){
            throw err;
        }
    },
    getManagers: async ()=> {
        try{
            managers = await Manager.find();
            return managers.map(manager => {
            return { ...manager._doc,
                _id: manager._id }
            });
        }
        catch(err){
            throw new Error('Failed to get all managers')
        }
    },
    //Manager mutation resolvers
    loginManager: async (args) => {
        var manager = await Manager.findOne({ username: args.username });
        if (!manager) {
            throw new Error('Manager does not exist!');
        }
        const isEqual = await bcrypt.compare(args.password, manager.password);
        if (isEqual) {
            Manager.updateOne({username: args.username}, {online: true});
        } else{
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
            {userId: manager._id,
            userType: 1},
            'somesupersecretkey',// appropriate key??
            {
                expiresIn: '1h'
            }
        );
        return { userId: manager._id, userType: 1, token: token, tokenExpiration: 1 };
    },

    insertManager: async (args) => {
        try{
            //check if manager already exists
            const existingManager = await Manager.findOne({username: args.username});
            if(existingManager){
                throw new Error('Manager already exists');
            }
            let attributes = await getActiveAttributes(args);
            const hashedPassword = await bcrypt.hash(attributes.password, 12);
            attributes.password = hashedPassword;

            const newManager = await new Manager(attributes);
            newManager.save();
            return newManager;
        } catch(err){
            throw err;
        }
    },

    deleteManager: async (args) => {
        try{
            var deletedManager = await Manager.deleteOne({_id: args._id});
            if(deletedManager){
                return true;
            }else{
                return false;
            }
        }catch(err){
            throw err;
        }
    },

    updateManager: async (args) => {
        try{
            let attributes = getActiveAttributes(args);
            updatedManager = await Manager.findOneAndUpdate({_id: args._id}, attributes, {new:true});
            return updatedManager;
        }catch(err) {
            throw err;
        }
    },

    /**
     * updateManagerUsername
     * updateManagerPassword
     * 
     *      */

    updateManagerCredentials: async (args,req, res) => {
        try{
            var manager = await Manager.findOne({ _id: args._id });
            const isEqual = await bcrypt.compare(args.oldPassword, manager.password);
            let nonEmptyNewPassword = false;
            let nonEmptyNewUsername = false
            let updatedManager = null;
            
            if( args.password !== null && args.password !== undefined && args.password !== ""){
                nonEmptyNewPassword = true;
            }
            if(nonEmptyNewPassword && !isEqual){
                throw new Error("IncorrectPassword");
            }
            if( args.username !== null && args.username !== undefined && args.username !== ""){
                nonEmptyNewUsername = true;
                const takenUsername = await Manager.findOne({ username: args.username });
                if(takenUsername){
                    throw new Error("UsernameTaken");
                }
            }
            if (!manager) {
                throw new Error('Manager does not exist!');
            }
            // throw all possible errors before updating and/or returning
            if(nonEmptyNewUsername){
                updatedManager = await Manager.findOneAndUpdate({_id: args._id}, {username: args.username}, {new: true});
            }
            if(isEqual && nonEmptyNewPassword){  
                const hashedPassword = await bcrypt.hash(args.password, 12);
                updatedManager = await Manager.findOneAndUpdate({_id: args._id}, {password: hashedPassword}, {new: true});
            }
            return updatedManager;
        }catch(err){
            return err;
        }
    },

    adminUpdateProsumerCredentials: async (args,req, res) => {
        try{
            var prosumer = await Prosumer.findOne({ _id: args._id });
            let nonEmptyNewPassword = false;
            let nonEmptyNewUsername = false
            let updatedProsumer = null;
            
            if( args.password !== null && args.password !== undefined && args.password !== ""){
                nonEmptyNewPassword = true;
            }
            if( args.username !== null && args.username !== undefined && args.username !== ""){
                nonEmptyNewUsername = true;
                const takenUsername = await Prosumer.findOne({ username: args.username });
                if(takenUsername){
                    throw new Error("UsernameTaken");
                }
            }
            if (!prosumer) {
                throw new Error('Prosumer does not exist!');
            }
            // throw all possible errors before updating and/or returning
            if(nonEmptyNewUsername){
                updatedProsumer = await Prosumer.findOneAndUpdate({_id: args._id}, {username: args.username}, {new: true});
            }
            if(nonEmptyNewPassword){  
                const hashedPassword = await bcrypt.hash(args.password, 12);
                updatedProsumer = await Prosumer.findOneAndUpdate({_id: args._id}, {password: hashedPassword}, {new: true});
            }
            return updatedProsumer;
        }catch(err){
            return err;
        }
    }
}