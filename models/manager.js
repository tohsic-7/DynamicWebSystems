var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var managerSchema = new Schema({
    username: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    buffer: {type: Number, default: 0},
    consumption: {type: Number, default: 0},
    production: {type: Number, default: 0},
    ratio:{type: Number, default: 0},
    status: {type: String, default: "stopped"},
    demand: {type: Number, default: 0},
    price: {type: Number, default: 0},
    img_path: String
});

module.exports = mongoose.model('Manager', managerSchema, 'manager');