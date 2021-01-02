const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findOneAndUpdate } = require('../../../models/manager');

const Manager = require("../../../models/manager");


function getActiveAttributes(args){
    // Set all manager attributes regardless if they're null/undefined
    activeAttributes = {
        username: args.username,
        password: args.password,
        buffer: args.buffer,
        buffer_size: args.buffer_size,
        consumption: args.consumption,
        production: args.production,
        status: args.status,
        ratio: args.ratio,
        demand: args.demand,
        price: args.price,
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
            Manager.updateOne({username: args.username}, {online: true}, {new:true});
        } else{
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
            { userId: manager._id, username: manager.username },
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

    updateManagerCredentials: async (args) => {
        try{
            var manager = await Manager.findOne({ _id: args._id });
            if (!manager) {
                throw new Error('Manager does not exist!');
            }
            if(args.password === null || args.password === undefined){
                //only update username
                updatedManager = await Manager.findOneAndUpdate({_id: args._id}, {username: args.username}, {new: true});
                return updatedManager;
            }
            const isEqual = await bcrypt.compare(args.oldPassword, manager.password);
            if(isEqual){    
                let updatedManager = null;
                if(args.username === null || args.username === undefined){
                    //only update password
                    const hashedPassword = await bcrypt.hash(args.password, 12);
                    updatedManager = await Manager.findOneAndUpdate({_id: args._id}, {password: hashedPassword}, {new: true});
                }
                else if(args.username !== null || args.username !== undefined || args.password === null || args.password === undefined){
                    //update username and password
                    const hashedPassword = await bcrypt.hash(args.password, 12);
                    updatedManager = await Manager.findOneAndUpdate({_id: args._id}, {username: args.username, password: hashedPassword}, {new: true});
                }
                return updatedManager;
            }else{
                throw new Error('Password is incorrect');
            }
        }catch(err){
            throw err;
        }
    }
}