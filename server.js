var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema, GraphQLObjectType } = require('graphql');
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/grid";

//-------Models---------
var Prosumer = require('./models/prosumer');
var Consumer = require('./models/consumer');
var Manager = require('./models/manager');


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true});


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    getConsumers: [Consumer]
  }

  type Consumer{
    id: Int,
    consumption: Int
}

type Mutation{
  insertConsumer(id: Int, consumption: Int):Consumer
}
`);
 
// The root provides a resolver function for each API endpoint
var root = {
  hello: () => { 
    return 'Hejsan';
  },
  getConsumers: ()=> {
    values = Consumer.find(function(err, result){
      result.forEach(element => console.log(element.consumption));
    });
    return values;
  }
  ,
    insertConsumer: (args) => {
      var consumer = new Consumer({id: args.id, consumption: args.consumption});
      consumer.save(function(err, result){
        if (err) return console.error(err);
      });
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