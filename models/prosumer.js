var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var prosumerSchema = new Schema({
    id: Number,
    username: {type: String, required: true, index: {unique:true}},
    password: {type: String, required: true},
    buffer: Number,
    wind: Number,
    consumption: Number,
    production: Number,
    ratio_excess: Number,
    ratio_under: Number,
    online: Boolean,
    img_path: String
});

prosumerSchema.pre('save', function(next) {
    var prosumer = this;

    // only hash the password if it has been modified (or is new)
    if (!prosumer.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(prosumer.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            prosumer.password = hash;
            next();
        });
    });
});
     
prosumerSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Prosumer', prosumerSchema, 'prosumer');