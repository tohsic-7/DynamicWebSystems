var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var consumerSchema = new Schema({
    consumption: {type: Number, default: 0},
    blackout: {type: Boolean, default: false}
});

module.exports = mongoose.model('Consumer', consumerSchema, 'consumer');