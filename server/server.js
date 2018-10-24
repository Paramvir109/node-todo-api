//Mongoose is an Object Document Mapper (ODM). This means that Mongoose allows you to define objects 
// /with a strongly-typed schema that is mapped to a MongoDB document.
//Use killall -9 node to kill the server running(EADDR error)
require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');//Parses string to json body for POST operations
const {ObjectID} = require('mongodb')
const _ = require('lodash')
const bcrypt = require('bcryptjs')


var {authenticate} = require('./middleware/authenticate')
var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/users')

var app = express()
const port = process.env.PORT || 3000 //For heroku
app.use(bodyParser.json())//return value of this method is being given as middleware

app.post('/todos', (req, res) => {//URl to which we want to send json data(todo)
    //console.log(req.body)
    let todo = new Todo({
        text : req.body.text
    })
    
    todo.save().then((doc) => {
        res.send(doc);
    },(e) => {
        res.status(400).send(e)
    })
})

app.get('/todos', (req,res) => {
    Todo.find().then((todos) => {
        res.send({todos})//will send object with todos prop with value which is an array
    }, (e) => {console.log(e)})
})

//fetching an individual todo
app.get('/todos/:id', (req, res) => {//Use : for query params
    const id = req.params.id;//req.params will be an object with id property with value we specify
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid object id')
    }
    Todo.findById(id).then((todo) => {
        if(todo){//If doc exists
           return res.send({todo})
        }
        res.status(404).send(todo)
    }).catch((e) => res.status(400).send(e))

})
//Deleting todos
//Todo.remove({}).then((res)=>{},(e) => {})... -> removes all todos(res is an object)
//Todo.findOneAndRemove().... Todo.findbyidandremove()- These will return the deleted object
app.delete('/todos/:id', (req, res) => {//Use : for query params
    const id = req.params.id;//req.params will be an object with id property with value we specify
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid object id')
    }
    Todo.findByIdAndDelete(id).then((todo) => {
        if(todo){
           return res.send({todo})
        }
        res.status(404).send()
    }).catch((e) => res.status(400).send(e))

})
app.patch('/todos/:id' , (req, res) =>{  
    const id = req.params.id;
    var body = _.pick(req.body , ['text' , 'completed'])//User can only change these props in req.body object

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid object id')
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()//Return ms after january 1 midnight 1970(UNIX APIC)
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set : body}, {new : true})
    .then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo})
    }).catch((e) => res.status(400).send())
})

//POST user(as we have made changes in user model Therefore drop the database before proceeding with the route)
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password'])
    let newUser = new User(body)
    newUser.save().then((user) => {
        return user.generateAuthToken()//Instance method(Different from model method)
    }).then((token) => {//To json is overrided method in schemas
        res.header('x-auth' , token).send(newUser.toJSON())//Use x auth for more flexibilty
    }).catch((e) => res.status(400).send(e))
})



//Private route
app.get('/users/me' , authenticate,(req, res) => {
   res.send(req.user)
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
});



module.exports = {app}


