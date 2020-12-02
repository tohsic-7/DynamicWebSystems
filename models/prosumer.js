var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var prosumerSchema = new Schema({
    username: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    buffer: {type: Number, default: 0},
    wind: {type: Number, default: 0},
    consumption: {type: Number, default: 0},
    production: {type: Number, default: 0},
    ratio_excess: {type: Number, default: 0},
    ratio_under: {type: Number, default: 0},
    online: {type: Boolean, default:false},
    img_path: String
});

module.exports = mongoose.model('Prosumer', prosumerSchema, 'prosumer');