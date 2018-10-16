//Mongoose is an Object Document Mapper (ODM). This means that Mongoose allows you to define objects 
// /with a strongly-typed schema that is mapped to a MongoDB document.
//Use killall -9 node to kill the server running(EADDR error)
const express = require('express');
const bodyParser = require('body-parser');//Parses string to json body for POST operations

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/users')

var app = express()
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
        res.send(todos)
    }, (e) => {console.log(e)})
})
app.listen(3000, () => {
    console.log('Server running')
});

module.exports = {app}


