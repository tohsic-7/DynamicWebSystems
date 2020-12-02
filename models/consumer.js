var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var consumerSchema = new Schema({
    consumption: {type: Number, default:1}
});

module.exports = mongoose.model('Consumer', consumerSchema, 'consumer');