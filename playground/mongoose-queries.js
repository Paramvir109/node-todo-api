const {Todo} = require('./../server/models/todo')
const {mongoose} = require('./../server/db/mongoose')
const {ObjectID} = require('mongodb')

const id = '5bc6417423b87c320872fcf1'

if(!ObjectID.isValid(id)) {
    console.log('ID not valid')
}

Todo.find({
    _id : id //Automatically converts into object id(not possible in native mongo db node)
}).then((todos) => {
    console.log(todos)//if no element with the id found then empty array
}).catch((e) => {
    console.log(e)
})

Todo.findOne({//returns first one
    _id : id 
}).then((todo) => {
    if(todo === null) {
        return console.log('NO TODO')
    }
    console.log(todo)
}).catch((e) => {
    console.log(e)
})

Todo.findById(id).then((todo) => { 
    if(todo === null) {
        return console.log('NO TODO')
    }
    console.log(todo)
}).catch((e) => {
    console.log(e)
})