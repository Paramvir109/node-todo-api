//const MongoClient = require('mongodb').MongoClient

const {MongoClient, ObjectID} = require('mongodb')//Object destructuring 


MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true }, (err, client) => {
    if(err) {
        return(console.log('Unable to connect'))
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // db.collection('Todos').findOneAndUpdate({
    //     text: 'Complete homework'//filtering the document//Updates the first encountered
    // }, {
    //     $set : {//mongo update operators
    //         completed : true
    //     }
    // }, {
    //     returnOriginal : false
    // }).then((res) => {
    //     console.log("Document updated", JSON.stringify(res,undefined,2))
    // }, (err) => {
    //     console.log(err);
    // })
    db.collection('Users').findOneAndUpdate({
        _id : ObjectID("5bc199f2861bd2378ab5f4bc")
    }, {
        $inc : {
            age : 1 //Increments age by one
        }
    }, {
        returnOriginal : false
    }).then((res) => {
        console.log("Document updated", JSON.stringify(res,undefined,2))
    }, (err) => {
        console.log(err);
    })
})