const blogsRouter = require('express').Router()
const json_web_token = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/api/blogs', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

const validateToken = request => {
    const authorization = request.get('authorization')
    if (!authorization) {
        return null
    }
    if (authorization.toLowerCase().startsWith('bearer ')) {
        return json_web_token.verify(
            authorization.substring(7),
            process.env.SECRET
        )
    }
    return null
}

blogsRouter.post('/api/blogs', async (request, response) => {
    const { title, author, url, likes } = request.body

    const decodedToken = json_web_token.verify(
        request.token,
        process.env.SECRET
    )
    if (!decodedToken) {
        return response.status(401).json(
            { error: 'token missing or invalid' }
        )
    }


    if (request.body.hasOwnProperty('likes') == false) {
        request.body['likes'] = 0
    }

    if (request.body.hasOwnProperty('url') == false &&
        request.body.hasOwnProperty('title') == false) {
        response.status(400).end()
    }

    const user_for_id = await User.findById(decodedToken.id)
    const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: user_for_id._id
    })
    const saved_blog = await blog.save()
    user_for_id.blogs = user_for_id.blogs.concat(saved_blog._id)
    await user_for_id.save()
    response.status(201).json(saved_blog)


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