const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./api_test_helper')

beforeEach(async () => {
    await User.deleteMany({})
    for (const user of helper.initialUsers) {
        await api.post('/api/users').send(user)
    }
    await Blog.deleteMany({})
    const users = await helper.usersInDb()
    const blogs_to_save = []
    users.forEach(user => {
        helper.initialBlogs.forEach(blog => {
            blog.user = user.id
            blogs_to_save.push(blog)
        })
    })
    await Blog.insertMany(blogs_to_save)
})

test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('return right amount of blogs', async () => {
    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length * 2)
})

test('returns json that has \'id\' field', async () => {
    response = await api.get('/api/blogs')
    expect(response.body[0]['id']).toBeDefined()
})


test('post with token creates new blog', async () => {
    const { username, password } = helper.initialUsers[0]
    const loginResponse = await api
        .post('/api/login')
        .send({
            username: username,
            password: password
        })
    const authToken = loginResponse.body.token
    const newBlog = {
        title: "uus for post",
        author: "uus autori",
        url: "uus.com",
        likes: 100,
    }
    response = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
})

test('post without token does not create a new blog', async () => {

    const newBlog = {
        title: "uus for post",
        author: "uus autori",
        url: "uus.com",
        likes: 100,
    }
    response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

})

test('post creates new __blog and handles likes not defined to 0 likes', async () => {
    const newBlog = {
        title: "post no likes",
        author: "autori no lieks",
        url: "uus.com",
    }
    const token = await helper.getAuthToken(api)
    response = response = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const blogsAfterPost = await helper.blogsInDb()
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

    const blogsBeforeDelete = await helper.blogsInDb()
    const token = await helper.getAuthToken(api)
    const blogToDelete = blogsBeforeDelete[1]
    response = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)
    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete)
        .toHaveLength(blogsBeforeDelete.length - 1)



})


test('modify a blog', async () => {
    const blogsBeforeUpdate = await helper.blogsInDb()
    const token = await helper.getAuthToken(api)
    const mofifiedBlog = blogsBeforeUpdate[0]
    mofifiedBlog.likes = 500
    const response = await api
        .put(`/api/blogs/${mofifiedBlog.id}`)
        .set('Authorization', `bearer ${token}`)
        .send(mofifiedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.likes)
        .toEqual(500)
    const blogsAfterPut = await helper.blogsInDb()
    expect(blogsAfterPut).toHaveLength(
        blogsBeforeUpdate.length
    )
})


afterAll(() => {
    mongoose.connection.close()
})