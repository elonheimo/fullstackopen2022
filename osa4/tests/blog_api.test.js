const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./blog_api_test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('return right amount of blogs', async () => {
    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('returns json that has \'id\' field', async () => {
    response = await api.get('/api/blogs')
    expect(response.body[0]['id']).toBeDefined()
})


test('post creates new blog', async () => {
    const newBlog = {

        title: "uus for post",
        author: "uus autori",
        url: "uus.com",
        likes: 100

    }

    response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const blogsAfterPost = await helper.blogsInDb()
    expect(blogsAfterPost).toHaveLength(
        helper.initialBlogs.length + 1
    )

})
test('post creates new blog and handles likes not defined to 0 likes', async () => {
    const newBlog = {
        title: "post no likes",
        author: "autori no lieks",
        url: "uus.com",
    }
    response = response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const blogsAfterPost = await helper.blogsInDb()
    expect(blogsAfterPost).toHaveLength(
        helper.initialBlogs.length + 1
    )
    expect(blogsAfterPost[blogsAfterPost.length - 1]['likes'])
        .toEqual(0)
})


afterAll(() => {
    mongoose.connection.close()
})