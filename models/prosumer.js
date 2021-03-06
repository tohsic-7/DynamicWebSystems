var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var prosumerSchema = new Schema({
    username: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    buffer: {type: Number, default: 0},
    buffer_size: {type: Number, default: 1000},
    wind: {type: Number, default: 0},
    consumption: {type: Number, default: 0},
    consumed_from_grid: {type: Number, default: 0},
    production: {type: Number, default: 0},
    ratio_excess: {type: Number, default: 50},
    ratio_under: {type: Number, default: 50},
    online: {type: Boolean, default:false},
    blackout: {type: Boolean, default: false},
    img_path: String,
    price: {type: Number, default: 0},
});

module.exports = mongoose.model('Prosumer', prosumerSchema, 'prosumer');