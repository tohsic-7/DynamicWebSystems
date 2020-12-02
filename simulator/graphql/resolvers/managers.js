const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Manager = require("../../../models/manager");


function getActiveAttributes(args){
    // Set all prosmanagerumer attributes regardless if they're null/undefined
    activeAttributes = {
        username: args.username,
        password: args.password,
        buffer: args.buffer,
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
        return { userId: manager._id, token: token, tokenExpiration: 1 };
    },

    insertManager: async (args) => {
        try{
            //check if manager already exists
            const existingManager = await Manager.findOne({username: args.username});
            if(existingManager){
                throw new Error('Manager already exists');
            }
            let attributes = await getActiveAttributes(args);
            console.log(attributes.password)
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
            updatedManager = await Manager.findOneAndUpdate({_id: args._id}, attributes, {new:true})
            return updatedManager;
        }catch(err) {
            throw err;
        }
    }
}