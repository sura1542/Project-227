const   mongoose = require('mongoose'),
        passwordLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    profileImage: String,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passwordLocalMongoose);

module.exports = mongoose.model('User',userSchema);