var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema, GraphQLObjectType } = require('graphql');
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/grid";

//-------Models---------
var Prosumer = require('./models/prosumer');
var Consumer = require('./models/consumer');
var Manager = require('./models/manager');
const { findOneAndUpdate } = require('./models/prosumer');


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: true});


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    getOneProsumer(id: Int): Prosumer
    getProsumers: [Prosumer]
    getOneConsumer(id: Int): Consumer
    getConsumers: [Consumer]
  }

  type Prosumer{
    id: Int,
    buffer: Int,
    wind: Int,
    consumption: Int,
    production: Int,
    ratio_excess: Int,
    ratio_under: Int,
    online: Boolean,
    img_path: String
  }

  type Consumer{
    id: Int,
    consumption: Int
  }

type Mutation{
  insertProsumer(
    id: Int,
    buffer: Int,
    wind: Int,
    consumption: Int,
    production: Int,
    ratio_excess: Int,
    ratio_under: Int,
    online: Boolean,
    img_path: String):Prosumer
  

  updateProsumer(
    id: Int,
    buffer: Int,
    wind: Int,
    consumption: Int,
    production: Int,
    ratio_excess: Int,
    ratio_under: Int,
    online: Boolean,
    img_path: String):Prosumer

  insertConsumer(
    id: Int,
    consumption: Int
    ):Consumer

  updateConsumer(
    id: Int,
    consumption: Int
  ) :Consumer

  deleteConsumer(
    id: Int
  ): Boolean
}

`);
 
// The root provides a resolver function for each API endpoint
var root = {
  getConsumers: ()=> {
    values = Consumer.find();
    return values;
  },

  getOneConsumer: (args)=> {
    values = Consumer.findOne({ id: args.id });
    return values;
  },

  // Consumer mutation resolvers
  insertConsumer: (args) => {
    var newConsumer = new Consumer({
      id: args.id, 
      consumption: args.consumption
    });

    newConsumer.save(function(err, result){
      if (err) return console.error(err);
    })

    return newConsumer;
  },

  updateConsumer: (args)=> {
    var filter = {id: args.id};
    var update = {
      id: args.id,
      consumption: args.consumption
    };

    for(var obj in update){
      if(update[obj] === null || update[obj] === undefined){
        delete update[obj];
      }
    }

    var values = Consumer.findOneAndUpdate(filter, update, {new:true}, function(err, res){
      if (err) return console.log(err);
    });
    return values;
  },

  deleteConsumer: (args)=> {
    Consumer.deleteOne({id: args.id},function(err, res){
      if (err) return console.log(err);
    });
    return true;
  },

  // Prosumer query resolvers
  getOneProsumer: (args)=> {
    values = Prosumer.findOne({ id: args.id });
    return values;
  },
  getProsumers: ()=> {
    var values = Prosumer.find(function(err, result){
      if(err) return console.error(err);
    });
    return values;
  },

  insertProsumer: (args) => {
    var newProsumer = new Prosumer({
      id: args.id,
      buffer: args.buffer,
      wind: args.wind,
      consumption: args.consumption,
      production: args.production,
      ratio_excess: args.ratio_excess,
      ratio_under: args.ratio_under,
      online: args.online,
      img_path: args.img_path
    });
    newProsumer.save(function(err, prosumer){
      if (err) return console.error(err);
    })
    return newProsumer;
  },

  updateProsumer: (args) => {
    values = Prosumer.findOne({ id: args.id });
    console.log(typeof values);
    values.buffer = args.buffer
    values.save(function(err, prosumer){
      if (err) return console.error(err);
    })
  },
};

 
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('server running'));
console.log('Running a GraphQL API server at http://localhost:4000/graphql');