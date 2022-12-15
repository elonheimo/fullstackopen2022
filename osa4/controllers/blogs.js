const blogsRouter = require('express').Router()
const json_web_token = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogsRouter.get('/api/blogs', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})


blogsRouter.post('/api/blogs', async (request, response) => {


    if (request.body.hasOwnProperty('url') == false &&
        request.body.hasOwnProperty('title') == false) {
        response.status(400).end()
    }

    if (request.body.hasOwnProperty('likes') == false) {
        request.body['likes'] = 0
    }
    const { title, author, url, likes } = request.body

    if (!request.user) {
        return response.status(401).json(
            { error: 'token missing or invalid' }
        )
    }


    const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: request.user._id.toString()
    })
    const saved_blog = await blog.save()
    request.user.blogs = request.user.blogs.concat(saved_blog._id)
    await request.user.save()
    response.status(201).json(saved_blog)


})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
    const blogToRemove = await Blog.findById(request.params.id)
    if (!request.user) {
        return response.status(401).json(
            { error: 'token missing or invalid' }
        )
    }

    if (blogToRemove.user.toString() === request.user._id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        return response.status(204).end()
    }
    return response.status(401).json(
        { error: 'not allowed to remove' }
    )
})

blogsRouter.put('/api/blogs/:id', async (request, response) => {
    const blogToUpdate = await Blog.findById(request.params.id)
    if (!request.user) {
        return response.status(401).json(
            { error: 'token missing or invalid' }
        )
    }
    if (blogToUpdate.user.toString() === request.user._id.toString()) {
        const blog = await Blog.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        )
        return response.status(200).json(blog)
    }

    return response.status(401).json(
        { error: 'not allowed to modify' }
    )
})

module.exports = blogsRouter