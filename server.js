var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./simulator/graphql/schema/index')
const graphqlResolver = require('./simulator/graphql/resolvers/index')
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/grid";

//-------Models---------
var Prosumer = require('./models/prosumer');
var Consumer = require('./models/consumer');
var Manager = require('./models/manager');
const { findOneAndUpdate } = require('./models/prosumer');
const prosumer = require('./models/prosumer');


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: true});
 
// The root provides a resolver function for each API endpoint
var root = {

  

  
};

// server setup
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,                                 //Remove on deployment
}));
app.listen(4000, () => console.log('server running'));
console.log('Running a GraphQL API server at http://localhost:4000/graphql');