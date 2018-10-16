const mongoose = require('mongoose')
mongoose.Promise  = global.Promise;//To tell mongoose we'll be using our inbuilt promise library

mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser : true})
//mongoose is maintaining this connection over time
//It actually waits to connect before making any requests
module.exports.mongoose = mongoose;