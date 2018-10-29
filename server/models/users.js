const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bcrypt = require('bcryptjs')


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
    tokens : [{//new object id for this object will automatcally get created
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
    var token = jwt.sign({_id : user._id.toHexString() , access}, 'abc123').toString();
    user.tokens = user.tokens.concat([{access, token}])
    return user.save().then(() => {
        return token
    })
}
UserSchema.methods.removeToken = function(token) {
    var user = this;
    return user.update({
        $pull : {//Array method (remove particular element of array {here the whole access and token object})
            tokens : {token}
        }
    })
}

UserSchema.statics.findByToken = function(token) {
    var User = this
    var decoded
    try {
        decoded = jwt.verify(token, 'abc123')//Will throw error if sth goes south
    } catch (error) {
        // return new Promise((resolve, reject) => {
        //     reject();//Will fire the catch block in server.js
        // })
        return Promise.reject();
    }
    return User.findOne({
        '_id' : decoded._id,
        'tokens.access' : 'auth',
        'tokens.token' : token
    })//Returns a promise
}
UserSchema.statics.findByCredentials = function(email, password) {
    var User = this
    return User.findOne({email}).then((user) => {
        if(!user) { 
            return Promise.reject();
        }
       return bcrypt.compare(password, user.password).then((res) => {
            if(res){
                return Promise.resolve(user)
            }
           return  Promise.reject()
        }).catch((e) =>  Promise.reject())
            
    })
}

UserSchema.pre('save', function(next) {//mongoose middleware
    var user = this//To get current instance 
    if(user.isModified('password')) {
        bcrypt.genSalt(10).then((salt) => {
            //more the no. of rounds more time bcrypt algo takes(prevent bruteforce attack)
            return bcrypt.hash(user.password, salt)
          }).then((hash) => {
            user.password = hash
            next()
          }).catch((e) =>{next(e)})
    }else {
        next();//if only emil is changed we dont want to generate new hash password
    }
})
var User = mongoose.model('User', UserSchema)
module.exports = {User}

// let myUser = new User({email : ' abc@pmail.com '}) ////We cant add here as no connection to database
// myUser.save().then((doc) => {
//     console.log('User added', doc)
// },(e) => {
//     console.log(e);
// })
