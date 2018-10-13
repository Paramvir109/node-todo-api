//const MongoClient = require('mongodb').MongoClient

const {MongoClient, ObjectID} = require('mongodb')//Object destructuring 


MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true }, (err, client) => {
    if(err) {
        return(console.log('Unable to connect'))
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // db.collection('Todos').deleteMany({text : 'Complete homework'}).then((res) => {
    //     console.log(res)
    // })

    // db.collection('Todos').deleteOne({text : 'Exercise'}).then((res) => { //Will delete first encountered
    //     console.log(res)
    // })

    db.collection('Todos').findOneAndDelete({completed : false}).then((res) => {
        console.log(res) //It is a different object whose value prop contains deleted object
        //Also contains (n : 1) no of deleted objects
    })
    //client.close()

})