const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        minlength : 1,
        unique : true,//No 2 docs can have same email
        validate : {
            // validator : (value) => {
            //     return validator.isEmail(value)
            // },
            validator : validator.isEmail,
            message : '{VALUE} is not a valid email'
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 6,

    },
    tokens : [{
        access :{
            type : String,
            required : true
        }, 
        token : {
            type : String,
            required : true
        }
    }]
})

UserSchema.methods.toJSON = function() {//Overrided method
    let userObject = this.toObject()
    return _.pick(userObject, ['email' , '_id'])//Only these props sent back
}

UserSchema.methods.generateAuthToken = function() {//This is an instance method(Relatod to individual user)
    var user = this;
    var access = 'auth';
    var token = jwt.sign({id : user._id.toHexString() , access}, 'abc123').toString();
    user.tokens = user.tokens.concat([{access, token}])
    return user.save().then(() => {
        return token
    })
}
var User = mongoose.model('User', UserSchema)
module.exports = {User}

// let myUser = new User({email : ' abc@pmail.com '}) ////We cant add here as no connection to database
// myUser.save().then((doc) => {
//     console.log('User added', doc)
// },(e) => {
//     console.log(e);
// })