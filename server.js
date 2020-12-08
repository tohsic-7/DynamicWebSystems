var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./simulator/graphql/schema/index')
const graphqlResolver = require('./simulator/graphql/resolvers/index')
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/grid";

//-------Models---------
var Prosumer = require('./models/prosumer');
var Consumer = require('./models/consumer');
var Manager = require('./models/manager');
const { findOneAndUpdate } = require('./models/prosumer');
const prosumer = require('./models/prosumer');


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: true});

var app = express();
 
// The root provides a resolver function for each API endpoint
var root = {

  

  
};
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// server setup
app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,                                 //Remove on deployment
}));
app.listen(4000, () => console.log('server running'));
console.log('Running a GraphQL API server at http://localhost:4000/graphql');