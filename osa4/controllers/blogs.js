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
    if (request.body.hasOwnProperty('url') == false &&
        request.body.hasOwnProperty('title') == false) {
        response.status(400).end()
    } else {
        const blog = await new Blog(request.body).save()
        response.status(201).json(blog)
    }

})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/api/blogs/:id', async (request, response) => {
    const blog = await Blog.findByIdAndUpdate(
        request.params.id,
        request.body,
        { new: true }
    )
    response.status(200).json(blog)
})

module.exports = blogsRouter