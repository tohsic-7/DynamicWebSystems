var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./simulator/graphql/schema/index')
const graphqlResolver = require('./simulator/graphql/resolvers/index')
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/grid";
const fs = require('fs');
const https = require('https');
var multer = require('multer');
var upload = multer({dest: 'public/'});
const path = require("path");


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: true});

var app = express();

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
 
app.use(bodyParser.json());
app.use("/public/prosumers", express.static("public"));
app.use("/public/managers", express.static("public"));

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
app.use('/graphql',
graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,                                 //Remove on deployment
}));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    /*Appending extension with original name*/
    cb(null, file.originalname) 
  }
})

var upload = multer({ storage: storage });

app.post("/uploadImage", upload.single('file'), function(req, res){
    if(req.file){
      return res.sendStatus(200);
    }
    else{
      return res.sendStatus(404);
    }

})

https.createServer(options, app).listen(4000, () => console.log('server running'));

console.log('Running a GraphQL API server at http://localhost:4000/graphql');