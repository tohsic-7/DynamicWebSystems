var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema, GraphQLObjectType } = require('graphql');
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/grid";

var Prosumer = require('./models/prosumer.js');
var Manager = require('./models/manager.js');
var Consumer = require('./models/consumer.js');

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true});

var peopleSchema = new mongoose.Schema(
  {
    user_id: String
  }
);

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    getOneProsumer(id: Int): Prosumer
    getProsumers: [Prosumer]
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
  
}
`);
 
// The root provides a resolver function for each API endpoint
var root = {
  hello: () => { 
    return 'Hejsan';
  },
  getOneProsumer: (args)=> {
    values = Prosumer.findOne({ id: args.id });
    console.log(values);
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
  }
};

 
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('server running'));
console.log('Running a GraphQL API server at http://localhost:4000/graphql');