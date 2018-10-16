const expect = require('expect')
const request = require('supertest')

const app = require('./../server.js').app//Or use destructuring
const {Todo} = require('./../models/todo')
const {User} = require('./../models/users')

beforeEach((done) => {//to empty the database before all assertions
    Todo.deleteMany({}).then(() => done())

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
            Todo.find().then((todos) => {//Similar as mongodb native method
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
                expect(todos.length).toBe(0)
                done();
            }).catch((e) => {
                done(e)
            })
        })
    })
})


