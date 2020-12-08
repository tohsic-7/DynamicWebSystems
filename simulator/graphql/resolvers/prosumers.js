const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Prosumer = require("../../../models/prosumer");


function getActiveAttributes(args){
    // Set all prosumer attributes regardless if they're null/undefined
    activeAttributes = {
        username: args.username,
        password: args.password,
        buffer: args.buffer,
        buffer_size: args.buffer_size,
        wind: args.wind,
        consumption: args.consumption,
        production: args.production,
        ratio_excess: args.ratio_excess,
        ratio_under: args.ratio_under,
        online: args.online,
        blackout: args.blackout,
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
    // Prosumer query resolvers
    getOneProsumer: async (args)=> {
        try {    
            prosumer = Prosumer.findOne({ _id: args._id })
            return prosumer;
        }catch(err){
            throw err;
        }
    },
    getProsumers: async ()=> {
        try{
            prosumers = await Prosumer.find();
            return prosumers.map(prosumer => {
            return { ...prosumer._doc,
                _id: prosumer._id }
            });
        }
        catch(err){
            throw new Error('Failed to get all prosumers')
        }
    },

    //Prosumer mutation resolvers
    loginProsumer: async (args) => {
        var prosumer = await Prosumer.findOne({ username: args.username });
        if (!prosumer) {
            throw new Error('Prosumer does not exist!');
        }
        const isEqual = await bcrypt.compare(args.password, prosumer.password);
        if (isEqual) {
            Prosumer.updateOne({username: args.username}, {online: true}, {new:true});
        } else{
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
            { userId: prosumer._id, username: prosumer.username },
            'somesupersecretkey',// appropriate key??
            {
                expiresIn: '1h'
            }
        );
        return { userId: prosumer._id, token: token, tokenExpiration: 1 };
    },

    insertProsumer: async (args) => {
        try{
            //check if prosumer already exists
            const existingProsumer = await Prosumer.findOne({username: args.username});
            if(existingProsumer){
                throw new Error('Prosumer already exists');
            }
            let attributes = getActiveAttributes(args);
            const hashedPassword = await bcrypt.hash(attributes.password, 12);
            attributes.password = hashedPassword;

            const newProsumer = await new Prosumer(attributes);
            newProsumer.save();
            return newProsumer;
        } catch(err){
            throw err;
        }
    },

    deleteProsumer: async (args) => {
        try{
            var deletedProsumer = await Prosumer.deleteOne({_id: args._id});
            if(deletedProsumer){
                return true;
            }else{
                return false;
            }
        }catch(err){
            throw err;
        }
    },

    updateProsumer: async (args) => {
        try{
            let attributes = getActiveAttributes(args);
            updatedProsumer = await Prosumer.findOneAndUpdate({_id: args._id}, attributes, {new:true})
            return updatedProsumer;
        }catch(err) {
            throw err;
        }
    }
}