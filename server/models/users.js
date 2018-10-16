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

// let myUser = new User({email : ' abc@pmail.com '})
// myUser.save().then((doc) => {
//     console.log('User added', doc)
// },(e) => {
//     console.log(e);
// })