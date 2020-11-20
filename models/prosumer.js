var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var prosumerSchema = new Schema({
    id: Number,
    buffer: Number,
    wind: Number,
    consumption: Number,
    production: Number,
    ratio_excess: Number,
    ratio_under: Number,
    online: Boolean,
    img_path: String
});

module.exports = mongoose.model('Prosumer', prosumerSchema, 'prosumer');