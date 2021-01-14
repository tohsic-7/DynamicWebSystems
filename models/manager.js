var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var managerSchema = new Schema({
    username: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    buffer: {type: Number, default: 0},
    buffer_size: {type: Number, required: true},
    consumption: {type: Number, default: 1000},
    production: {type: Number, default: 0},
    production_cap: {type: Number, default: 1000},
    ratio:{type: Number, default: 20},
    status: {type: String, default: "stopped"},
    timer: {type: Number, default: 0},
    demand: {type: Number, default: 0},
    price: {type: Number, default: 0},
    modelled_price: {type: Number, default: 0},
    price_bool: {type: Boolean, default: true},
    img_path: String
});

module.exports = mongoose.model('Manager', managerSchema, 'manager');