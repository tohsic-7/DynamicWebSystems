var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema, GraphQLObjectType } = require('graphql');
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/grid";


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true});

var peopleSchema = new mongoose.Schema(
  {
    user_id: String
  }
);

var Model = mongoose.model("model",peopleSchema, "prosumer");


const PersonType = new GraphQLObjectType({
    name: "Person",
    fields: {
      user_id: {type: String}
    }
});



// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    getPeople: [Person]
  }

  type Person{
    user_id: String
}

type Mutation{
  insertPerson(user_id: String):Person
}
`);
 
// The root provides a resolver function for each API endpoint
var root = {
  hello: () => { 
    return 'Hejsan';
  },
  getPeople: ()=> {
    values = dbo.collection('people').find().toArray().then(res => { return res });
    return values;
  }
  ,
    insertPerson: (args) => {
      var pep = new Model({user_id: args.user_id});
      pep.save(function(err, person){
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