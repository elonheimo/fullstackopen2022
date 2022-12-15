const mongoose = require('mongoose')
const supertest = require('supertest')
const { response } = require('../app')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

const helper = require('./api_test_helper')
beforeEach(async () => {
    await User.deleteMany({})
})
test('post creates new user', async () => {

    const usersBeforePost = await helper.usersInDb()

    const random_username = (Math.random() + 1).toString(36).substring(0).repeat(3)
    const newUser = {
        username: random_username,
        name: "uus autori",
        password: "uus.com",
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const usersAfterPost = await helper.usersInDb()
    expect(usersBeforePost).toHaveLength(
        usersAfterPost.length - 1
    )
})

test('post user too short name', async () => {
    const newUser = {
        username: "a",
        name: "uus autori",
        password: "uus.com",
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(response.body.error)
        .toContain('ser validation failed: username: Path `username` (`a`) is shorter than the minimum allowed length (3).')
})

test('post user too short paswword', async () => {
    const newUser = {
        username: "aaa",
        name: "uus autori",
        password: ":(",
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(response.body.error)
        .toContain('password shoulbe 3 characters or longer')
})


afterAll(() => {
    mongoose.connection.close()
})