const { buildSchema } = require('graphql')


// Construct a schema, using GraphQL schema language
module.exports = buildSchema(`
type Prosumer{
  _id: ID!,
  username: String!,
  password: String!,
  buffer: Int,
  buffer_size: Int!,
  wind: Int,
  consumption: Int,
  production: Int,
  ratio_excess: Int,
  ratio_under: Int,
  online: Boolean,
  img_path: String
}

type Consumer{
  _id: ID!,
  consumption: Int,
  blackout: Boolean
}

type Manager{
  _id: ID!,
  username: String!,
  password: String!,
  buffer: Int,
  consumption: Int,
  production: Int,
  status: String,
  ratio: Int,
  demand: Int,
  price: Int,
  img_path: String
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

type RootQuery {
    getOneProsumer(_id: ID!): Prosumer
    getProsumers: [Prosumer]
    getOneManager(_id: ID!): Manager
    getManagers: [Manager]
    getOneConsumer(_id: ID!): Consumer
    getConsumers: [Consumer]
  }

type RootMutation{
    loginProsumer(username:String, password:String): AuthData
    loginManager(username:String, password:String): AuthData

    insertProsumer(
        username: String!,
        password: String!,
        buffer: Int,
        buffer_size: Int!,
        wind: Int,
        consumption: Int,
        production: Int,
        ratio_excess: Int,
        ratio_under: Int,
        online: Boolean,
        blackout: Boolean,
        img_path: String
    ):Prosumer!

    deleteProsumer(_id:ID!): Boolean

    updateProsumer(
        _id: ID!,
        buffer: Int,
        buffer_size: Int,
        wind: Int,
        consumption: Int,
        production: Int,
        ratio_excess: Int,
        ratio_under: Int,
        online: Boolean,
        blackout: Boolean,
        img_path: String
    ):Prosumer

    insertManager(
        username: String!,
        password: String!,
        buffer: Int,
        consumption: Int,
        production: Int,
        status: String,
        ratio: Int,
        demand: Int,
        price: Int,
        img_path: String
    ): Manager

    deleteManager(_id:ID!): Boolean

    updateManager(
        _id: ID!,
        buffer: Int,
        consumption: Int,
        production: Int,
        status: String,
        ratio: Int,
        demand: Int,
        price: Int,
        img_path: String
    ):Manager

    insertConsumer(
        consumption: Int,
        blackout: Boolean
    ):Consumer

    updateConsumer(
        _id: ID!,
        consumption: Int,
        blackout: Boolean
    ) :Consumer

    deleteConsumer(
        _id: ID!
    ): Boolean
}

schema{
    query: RootQuery
    mutation: RootMutation
  }

`);

// TODO: Add authorization type