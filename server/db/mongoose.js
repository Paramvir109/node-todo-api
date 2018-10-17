const mongoose = require('mongoose')
mongoose.Promise  = global.Promise;//To tell mongoose we'll be using our inbuilt promise library

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {useNewUrlParser : true})
//First for heroku deployement
//mongoose is maintaining this connection over time
//It actually waits to connect before making any requests
module.exports.mongoose = mongoose;