const { buildSchema } = require('graphql')


// Construct a schema, using GraphQL schema language
module.exports = buildSchema(`
type Prosumer{
  _id: ID!,
  username: String!,
  password: String!,
  buffer: Float,
  buffer_size: Float!,
  wind: Float,
  consumption: Float,
  consumed_from_grid: Float,
  production: Float,
  ratio_excess: Int,
  ratio_under: Int,
  online: Boolean,
  blackout: Boolean,
  img_path: String,
  price: Float
}

type Consumer{
  _id: ID!,
  consumption: Float,
  blackout: Boolean
}

type Manager{
  _id: ID!,
  username: String!,
  password: String!,
  buffer: Float,
  buffer_size: Float!,
  consumption: Float,
  production: Float,
  production_cap: Float,
  status: String,
  timer: Int,
  ratio: Int,
  demand: Float,
  price: Float,
  modelled_price: Float,
  price_bool: Boolean,
  img_path: String
}

type AuthData {
  userId: ID!
  userType: Int!
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
        buffer: Float,
        buffer_size: Float,
        wind: Float,
        consumption: Float,
        consumed_from_grid: Float,
        production: Float,
        ratio_excess: Int,
        ratio_under: Int,
        online: Boolean,
        blackout: Boolean,
        img_path: String,
        price: Float
    ):Prosumer!

    deleteProsumer(_id:ID!): Boolean

    updateProsumer(
      _id: ID!,
        buffer: Float,
        buffer_size: Float,
        wind: Float,
        consumption: Float,
        consumed_from_grid: Float,
        production: Float,
        ratio_excess: Int,
        ratio_under: Int,
        online: Boolean,
        blackout: Boolean,
        img_path: String,
        price: Float
    ):Prosumer

    insertManager(
        username: String!,
        password: String!,
        buffer: Float,
        buffer_size: Float!,
        consumption: Float,
        production: Float,
        production_cap: Float,
        status: String,
        timer: Int,
        ratio: Int,
        demand: Float,
        price: Float,
        modelled_price: Float,
        price_bool: Boolean,
        img_path: String
    ): Manager

    deleteManager(_id:ID!): Boolean

    updateManager(
        _id: ID!,
        buffer: Float,
        buffer_size: Float,
        consumption: Float,
        production: Float,
        production_cap: Float,
        status: String,
        timer: Int,
        ratio: Int,
        demand: Float,
        price: Float,
        modelled_price: Float,
        price_bool: Boolean,
        img_path: String
    ):Manager

    updateManagerCredentials(
      _id: ID!, 
      username:String, 
      password: String,
      oldPassword: String):Manager

    insertConsumer(
        consumption: Float,
        blackout: Boolean
    ):Consumer

    updateConsumer(
        _id: ID!,
        consumption: Float,
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