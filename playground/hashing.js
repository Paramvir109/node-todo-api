const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, '123abc');//123abc is our salt
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

var message = 'Hello test'
var hash = SHA256(message).toString()
console.log(message, hash)
// var data = {//Response of server to client
//     id : 4
// }

// var token = {//We hash the data so user can't manipulate the id and thus get access of some other user's data
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString() //Somesecret is the salt used here
// }
//
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }

