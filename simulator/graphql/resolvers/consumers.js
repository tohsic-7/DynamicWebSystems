const Consumer = require("../../../models/consumer");



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
            const consumer = new Consumer({
              consumption: args.consumption
            });
      
            const result = await consumer.save();
      
            return { ...result._doc, _id: result.id };
          } catch (err) {
            throw err;
          }
    },

    updateConsumer: async (args)=> {
        try{
            const updatedConsumer = await Consumer.findOneAndUpdate({_id: args._id}, {consumption: args.consumption}, {new:true})
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