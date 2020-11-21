var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema, GraphQLObjectType } = require('graphql');
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/grid";

//-------Models---------
var Prosumer = require('./models/prosumer');
var Consumer = require('./models/consumer');
var Manager = require('./models/manager');


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:true});


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    getOneProsumer(id: Int): Prosumer
    getProsumers: [Prosumer]
    getOneManager(id: Int): Manager
    getManagers: [Manager]
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

  type Manager{
    id: Int,
    buffer: Int,
    consumption: Int,
    production: Int,
    status: Boolean,
    ratio: Int,
    demand: Int,
    price: Int,
    img_path: String
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
  
  deleteProsumer(id:Int!): Prosumer

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

  insertManager(
    id: Int,
    buffer: Int,
    consumption: Int,
    production: Int,
    status: Boolean,
    ratio: Int,
    demand: Int,
    price: Int,
    img_path: String): Manager
  
  deleteManager(id:Int!): Manager

  updateManager(
    id: Int,
    buffer: Int,
    consumption: Int,
    production: Int,
    status: Boolean,
    ratio: Int,
    demand: Int,
    price: Int,
    img_path: String):Manager

  insertConsumer(
    id: Int,
    consumption: Int
    ):Consumer

  updateConsumer(
    id: Int,
    consumption: Int
  ) :Consumer
  
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
    console.log(values);
  
    return values;
  },

  // Consumer mutation resolvers
  insertConsumer: (args) => {
    var consumer = new Consumer({id: args.id, consumption: args.consumption});
    consumer.save(function(err, result){
      if (err) return console.error(err);
    });
  },

  // Prosumer query resolvers
  getOneProsumer: (args)=> {
    values = Prosumer.findOne({ id: args.id }, function(err){
      if(err) return console.error(err);
    });  
    return values;
  },
  getProsumers: ()=> {
    var values = Prosumer.find(function(err, result){
      if(err) return console.error(err);
    });
    return values;
  },
  //Prosumer mutation resolvers
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

  deleteProsumer: (args) => {
    filter = {id: args.id};
    deadProsumer = Prosumer.deleteOne(filter, function(err){
      if (err) return console.error(err);
    });
    return deadProsumer;
  },

  updateProsumer: (args) => {
    var filter = { id: args.id };
    var update = {
      buffer: args.buffer,
      wind: args.wind,
      consumption: args.consumption,
      production: args.production,
      ratio_excess: args.ratio_excess,
      ratio_under: args.ratio_under,
      online: args.online,
      img_path: args.img_path
    }
    // Only update the non-null & defined values
    for(var property in update){
      if (update[property] === null || update[property] === undefined) {
        delete update[property];
      }
    }
    values = Prosumer.findOneAndUpdate(filter, update, {new:true}, function(err, prosumer){
      if (err) return console.error(err);
    });
    return values;
  },

  // Manager query resolvers
  getOneManager: (args)=> {
    values = Manager.findOne({ id: args.id }, function(err){
      if(err) return console.error(err);
    });  
    return values;
  },
  getManagers: ()=> {
    var values = Manager.find(function(err, result){
      if(err) return console.error(err);
    });
    return values;
  },
  //Manager mutation resolvers
  insertManager: (args) => {
    var newManager = new Manager({
      id: args.id,
      buffer: args.buffer,
      consumption: args.consumption,
      production: args.production,
      status: args.status,
      ratio: args.ratio,
      demand: args.demand,
      price: args.price,
      img_path: args.img_path
    });
    newManager.save(function(err, manager){
      if (err) return console.error(err);
    })
    return newManager;
  },

  deleteManager: (args) => {
    filter = {id: args.id};
    deadManager = Manager.deleteOne(filter, function(err){
      if (err) return console.error(err);
    });
    return deadManager;
  },

  updateManager: (args) => {
    var filter = { id: args.id };
    var update = {
      buffer: args.buffer,
      consumption: args.consumption,
      production: args.production,
      status: args.status,
      ratio: args.ratio,
      demand: args.demand,
      price: args.price,
      img_path: args.img_path
    }
    // Only update the non-null & defined values
    for(var property in update){
      if (update[property] === null || update[property] === undefined) {
        delete update[property];
      }
    }
    values = Manager.findOneAndUpdate(filter, update, {new:true}, function(err, prosumer){
      if (err) return console.error(err);
    });
    return values;
  },
  
};

// server setup
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('server running'));
console.log('Running a GraphQL API server at http://localhost:4000/graphql');