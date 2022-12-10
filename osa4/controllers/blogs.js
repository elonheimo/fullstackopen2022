const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
    if (request.body.hasOwnProperty('likes') == false) {
        request.body['likes'] = 0
    }
    const blog = await new Blog(request.body).save()
    response.status(201).json(blog)

})

module.exports = blogsRouter