const mongoose = require('mongoose')
var User = mongoose.model('User', {
    email : {
        type : String,
        required : true,
        trim : true,
        minlength : 1
    }
})
module.exports = {User}

// let myUser = new User({email : ' abc@pmail.com '}) ////We cant add here as no connection to database
// myUser.save().then((doc) => {
//     console.log('User added', doc)
// },(e) => {
//     console.log(e);
// })