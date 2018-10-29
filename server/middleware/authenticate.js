var {User} = require('./../models/users')


var authenticate = (req, res, next) => {//Middleware for express
    let token = req.header('x-auth')
    User.findByToken(token).then((user) => {
        if(!user) {//No user found 
            return Promise.reject()//will fire the catch block
        } 
        req.user = user;
        req.token = token;
        next();//only then rest of the route will execute(res.send())
    }).catch((e) => {
        res.status(401).send()//unauthorised
    })
}

module.exports = {
    authenticate
}