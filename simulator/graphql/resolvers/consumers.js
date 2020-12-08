const Consumer = require("../../../models/consumer");

function getActiveAttributes(args){
    // Set all prosumer attributes regardless if they're null/undefined
    activeAttributes = {
        consumption: args.consumption,
        blackout: args.blackout,
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
    getConsumers: async ()=> {
        try{
            consumers = await Consumer.find();
            return consumers.map(consumer => {
               return { ...consumer._doc, _id: consumer._id }
            });
        }
        catch(err){
            throw new Error('Failed to get all consumers')
        }
    },

    getOneConsumer: async (args)=> {
        try {
        foundConsumer = await Consumer.findOne({ _id: args._id });
        return foundConsumer;
        }catch(err){
            throw err;
        }
    },

    // Consumer mutation resolvers
    insertConsumer: async (args) => {
        try {
            let attributes = getActiveAttributes(args);
            const newConsumer = await new Consumer(attributes);
            newConsumer.save();
      
            return newConsumer;
          } catch (err) {
            throw err;
          }
    },

    updateConsumer: async (args)=> {
        try{
            let attributes = getActiveAttributes(args);
            const updatedConsumer = await Consumer.findOneAndUpdate({_id: args._id}, attributes, {new:true})
            return updatedConsumer;
        } catch (err){
            throw err;
        }
    },

    deleteConsumer: async (args)=> {
        try{
            Consumer.deleteOne({id: args.id})
            return true;
        }catch(err){
            throw err;
        }
    }
}