const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')


const app = require('./../server.js').app//Or use destructuring
const {Todo} = require('./../models/todo')
const {User} = require('./../models/users')

const myTodos = [
    {
        text : 'First test todo'
    },
    {
        _id : new ObjectID(),
        text : 'Second test todo'
    }

]

beforeEach((done) => {//to empty the database before all assertions for(post)
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(myTodos)
    }).then(() => done())

})

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


