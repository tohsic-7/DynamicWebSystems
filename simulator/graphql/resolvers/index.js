const consumerResolver = require('./consumers');
const prosumerResolver = require('./prosumers');
const managerResolver = require('./managers');

const rootResolver = {
  ...consumerResolver,
  ...prosumerResolver,
  ...managerResolver
};

module.exports = rootResolver;