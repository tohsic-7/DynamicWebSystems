var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var consumerSchema = new Schema({
    id: Number,
    consumption: Number
});

module.exports = mongoose.model('Consumer', consumerSchema, 'consumer');