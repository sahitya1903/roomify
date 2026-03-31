const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose= require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose.default);
//No need to define username, password in schema
// passportLocalMongoose automatically does it

module.exports = mongoose.model('User', userSchema);