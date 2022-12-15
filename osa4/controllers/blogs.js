const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/api/blogs', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})


blogsRouter.post('/api/blogs', async (request, response) => {
    const { title, author, url, likes } = request.body
    if (request.body.hasOwnProperty('likes') == false) {
        request.body['likes'] = 0
    }
    if (request.body.hasOwnProperty('url') == false &&
        request.body.hasOwnProperty('title') == false) {
        response.status(400).end()
    }
    const user_for_id = (await User.find({}))[0]
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