//const MongoClient = require('mongodb').MongoClient
//const ObjectID = require('mongodb').ObjectID
const {MongoClient, ObjectID} = require('mongodb')//Object destructuring 

//var obj = new ObjectID();//Creates a random object id see at bottom to see what it is

MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true }, (err, client) => {
    // (/TodoApp is the db u want to connect to)
    //Although todoapp db doesn't exist yet but mongo will automatically crete it if we start adding data into it
    if(err) {
        return(console.log('Unable to connect'))
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')
    // db.collection('Todos').insertOne({
    //     text : 'Something to do',//field
    //     completed : false
    // }, (err, result) => {
    //     if(err) {
    //         return(console.log('Unable to add document into collection', err))
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })
    db.collection('Users').insertOne({
        name : 'Paramvir Singh',//field
        age : 19,
        location : 'India'
    }, (err, result) => {
        if(err) {
            return(console.log('Unable to add user document into collection', err))
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
        console.log(result.ops[0]._id.getTimestamp())
    })
    client.close();
})
//We can specify id by (_id :____ )
//ObjectID is a 12-byte value consisting of a 4-byte timestamp(when id was created)
//a 3-byte machine id(different for different machines), a 2-byte process id, and a 3-byte counter. 
//. This is because they are compared byte-by-byte and we want to ensure a mostly increasing order.