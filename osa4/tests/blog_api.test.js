const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./api_test_helper')

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

test('post new blog without title, url response status 400', async () => {
    const newBlog = {
        author: "autori no lieks",
    }
    response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

})

test('deletes existing blog', async () => {

    const blogsAfterPost = await helper.blogsInDb()
    const blogToDelete = blogsAfterPost[0]
    response = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete)
        .toHaveLength(helper.initialBlogs.length - 1)



})


test('modify a blog', async () => {
    const blogsAfterPost = await helper.blogsInDb()
    const mofifiedBlog = blogsAfterPost[0]
    mofifiedBlog.likes = 500
    const response = await api
        .put(`/api/blogs/${mofifiedBlog.id}`)
        .send(mofifiedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.likes)
        .toEqual(500)
    const blogsAfterPut = await helper.blogsInDb()
    expect(blogsAfterPut).toHaveLength(
        helper.initialBlogs.length
    )
})


afterAll(() => {
    mongoose.connection.close()
})