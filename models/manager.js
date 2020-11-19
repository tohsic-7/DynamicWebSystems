var mongoose = require('mongose');
var Schema = mongoose.Schema;

var managerSchema = new Schema({
    id: Number,
    buffer: Number,
    consumption: Number,
    production: Number,
    ratio:Number,
    status: Boolean,
    demand: Number,
    price: Number,
    img_path: String
});

module.exports = mongoose.model('Manager', managerSchema, 'manager');