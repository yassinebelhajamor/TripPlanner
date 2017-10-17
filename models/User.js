var mongoose = require('mongoose');
var validator = require('validator');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    FirstName : String,
    LastName : String,
    password : {type:String,default:null},
    email : {
        type:String,
        required:true,
        unique:true,
        minlength:1,
        trim:true,
        validate: {
            validator: validator.isEmail,

            message: '{VALUE} is not a valid email!'
        }
    },
    compte : {
        numero : String,
        amount : Number
    },
    experience : {
        bus : Number,
        train : Number,
        metro : Number,
        temps : Number,
        prix : Number
    }
},{collection:"User"});
module.exports = mongoose.model('Users', UserSchema);