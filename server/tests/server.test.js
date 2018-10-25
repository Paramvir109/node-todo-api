const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')


const app = require('./../server.js').app//Or use destructuring
const {Todo} = require('./../models/todo')
const {User} = require('./../models/users')
const {myTodos, populateTodos,myUser,populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('should create a new todo' , (done) => {
        let text = 'Test todo text'
        request(app)
        .post('/todos')
        .send({text})//supertest automatically converts it into json
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text)
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            } 
            Todo.find({text}).then((todos) => {//Similar as mongodb native method
                expect(todos.length).toBe(1)
                expect(todos[0].text).toBe(text)
                done();
            }).catch(e => {
                done(e)
            })
        });
    }) 
    it('should not create a new todo', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err) {
                return done(err)
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2)
                done();
            }).catch((e) => {
                done(e)
            })
        })
    })
})

describe('GET /todos' ,() => {
    it('should return the todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2)
          

        })
        .end(done);
    })
})
describe('GET /todos/:id' ,() => {
    it('should return the todo with specified id', (done) => {
        const id = myTodos[1]._id;
        request(app)
        .get(`/todos/${id.toHexString()}`)//We can send without hex string as well
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(myTodos[1].text);
        })
        .end(done);
    })
    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID();
        request(app)
        .get(`/todos/${id.toHexString()}`)//We can send without hex string as well
        .expect(404)
        
        .end(done);
    })

    it('should return 404 for invalid ID', (done) => {
        const id = '123'
        request(app)
        .get(`/todos/${id}`)//We can send without hex string as well
        .expect(404)
        
        .end(done);
    })
})

describe('DELETE /todos/:id' ,() => {
    it('should delete the todo with specified id', (done) => {
        const id = myTodos[1]._id;
        request(app)
        .delete(`/todos/${id.toHexString()}`)//We can send without hex string as well
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(myTodos[1].text);
        })
        .end((err,res) =>{
            if(err) {
               return done(err)
            }
            Todo.find().then((todos)=>{
                expect(todos).toExclude(myTodos[1])
                done()
            }).catch((e) => done(e))
        });
    })
    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID();
        request(app)
        .delete(`/todos/${id.toHexString()}`)//We can send without hex string as well
        .expect(404)
        
        .end(done);
    })

    it('should return 404 for invalid ID', (done) => {
        const id = '123'
        request(app)
        .get(`/todos/${id}`)//We can send without hex string as well
        .expect(404)
        
        .end(done);
    })
})
describe('PATCH todos/id', () => {
    it('should update the todo', (done) => {
        const id = myTodos[1]._id
        let upTodo = {
            text : 'Updated text',
            completed : true
        }
        request(app)
        .patch(`/todos/${id.toHexString()}`)
        .send(upTodo)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(upTodo.text)
            expect(res.body.todo.completedAt).toBeA('number')//Usie in quotes
        })
        .end(done)
    })
    it('should clear the completedAt when completed is false', (done) => {
        const id = myTodos[0]._id
        request(app)
        .patch(`/todos/${id.toHexString()}`)
        .send({completed : false})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done)
        
    })
})
describe('GET users/me' ,() => {
    it('should return the user if authenticated', (done) => {
        let token = myUser[0].tokens[0].token
        request(app)
        .get('/users/me')
        .set('x-auth', token)//This is how we set the header
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(myUser[0]._id.toHexString())
            expect(res.body.email).toBe(myUser[0].email)
        })
        .end(done)
    })
    it('should return 401 if unauthenticated' , (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({})
        })
        .end(done)
    })
})
describe('POST /users' ,() => {
    it('should add the user', (done) => {
        let user = {
            email : 'example@email.com',
            password : 'example123'
        }
        request(app)
        .post('/users')
        .send(user)
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist()
            expect(res.body._id).toExist()
            expect(res.body.email).toBe(user.email)
        })
        .end((err) => {
            if(err) {
               return done(err)
            }
            User.findOne({email : user.email}).then((doc) => {
                expect(doc).toExist()
                expect(doc.password).toNotEqual(user.password)
                done()
            })
        })
        
    })
    it('should return validation error if req invalid' , (done) => {
        let user = {
            email : 'exampleemailcom',//Invalid email or Invalid pass
            password : 'example123'
        }
        request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .end(done)
        
    })
    it('should not create a user if email in use' , (done) => {
        let user = {
            email : myUser[0].email,//Invalid email
            password : 'example123'
        }
        request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .end(done)
        
    })
})


