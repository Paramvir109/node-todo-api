//const MongoClient = require('mongodb').MongoClient

const {MongoClient, ObjectID} = require('mongodb')//Object destructuring 


MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true }, (err, client) => {
    if(err) {
        return(console.log('Unable to connect'))
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // db.collection('Todos').find(
    //     {
    //     _id : new ObjectID('5bc1bc1d8a9bb1b207262cb2')
    // })
    // .toArray().then((docs) => {//Finding based on query(can be empty too)
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('Unable to fetch data',err)
    // })
    // db.collection('Todos').find()
    // .count().then((count) => {//Finding based on query(can be empty too)
    //     console.log(`${count}(s) Todos`)
    // }, (err) => {
    //     console.log('Unable to fetch data',err)
    // })
    db.collection('Users').find({name : 'Paramvir Singh'})
    .toArray().then((user) => {//Finding based on query(can be empty too)
        console.log(` ${user.length} Todos
                ${JSON.stringify(user, undefined, 2)}`)
    }, (err) => {
        console.log('Unable to fetch data',err)
    })
    //client.close()

})