const mongoose = require('mongoose')

var Todo = mongoose.model('Todo', {//Now we can create instance of this model
    //mongoose will automatically lower cased and pluralise Todo --> todos
    //will automatically create todos collection
    text :{
        type : String,
        required : true,//validator
        minlength : 1//vaidator //trim : true(will remove leading and trailing spaces)
    },
    completed :{
        type : Boolean,
        default : false //no need to add todos which are already done
    },
    completedAt :{
        type : Number,
        default : null 
    },
    _creator : {//Only a creator can create a todo
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
})
module.exports = {Todo}

// var myTodo = new Todo({text:'Eat lunch'});
// myTodo.save().then((doc) => {
//     console.log("Doc saved", doc);
// }, (err) => {
//     console.log(err);
// });
// var myTodo1 = new Todo({text:'Eat Dinner' , completed : true, completedAt : 8});
// myTodo1.save().then((doc) => {
//     console.log("Doc saved", JSON.stringify(doc, undefined, 2));
// }, (err) => {
//     console.log(err);
// });

// var myTodo = new Todo({text:'Eat Breakfast'});//if text : 28 (mongoose automatically typecast it into a string)
// myTodo.save().then((doc) => {
//     console.log("Doc saved", JSON.stringify(doc, undefined, 2));
// }, (err) => {
//     console.log(err);
// });
