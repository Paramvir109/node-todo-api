const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken');


const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/users')
const user1ID = new ObjectID()
const user2ID = new ObjectID()

const myTodos = [
    {
        _id : new ObjectID(),
        text : 'First test todo',
        completed : true,
        completedAt : 333,
        _creator : user1ID
    },
    {
        _id : new ObjectID(),
        text : 'Second test todo',
        _creator : user2ID
    }

]
const populateTodos = (done) => {//to empty the database before all assertions for(post)
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(myTodos)
    }).then(() => done())

}

const myUser = [
    {
        _id : user1ID,
        email : 'okay@ymail.com',
        password : 'userpassone',
        tokens : [
            {
            access : 'auth',
            token : jwt.sign({_id : user1ID, access : 'auth'}, 'abc123').toString()
            }
        ]
    },
    {
        _id : user2ID,
        email : 'okay2@ymail.com',
        password : 'userpasstwo',
        tokens : [//adding this to change the tests.(Done at 14th video)
            {
            access : 'auth',
            token : jwt.sign({_id : user2ID, access : 'auth'}, 'abc123').toString()
            }
        ]
    }

]
const populateUsers = (done) => {//to empty the database before all assertions for(post)
    User.deleteMany({}).then(() => {
        let userOne = new User(myUser[0]).save()
        let userTwo = new User(myUser[1]).save()//We use save instead of insert to call the middleware
        
       return Promise.all([userOne, userTwo])//Will simultaneously resolve the promise
    }).then(() => done()).catch((e) => done(e))

}
module.exports = {
    myTodos,
    populateTodos,
    myUser,
    populateUsers
}