const Prosumer = new GraphQLObjectType({
    name: "Person",
    fields: {
      user_id: {type: Number},
      user_buffer: {type: Number},
      user_wind: {type: Number}
    }
});