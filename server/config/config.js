var config = require('./config.json')
var env = process.env.NODE_ENV || 'development'
//This only set inside heroku environment(gotta configure in package json to use for test environment)

if(env === 'development' || env === 'test') {
    var config = require('./config.json')
    var envConfig = config[env]
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key]//process.env.key(same thing)
    })//converts into array
}

// if(env === 'development') {//For production env already set
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
// } else if(env === 'test') {
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
// }