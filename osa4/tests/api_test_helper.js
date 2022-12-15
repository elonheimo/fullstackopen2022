const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "otsikko",
        author: "autori",
        url: "osoite.com",
        likes: 20
    }, {
        title: "otsikko1",
        author: "autori1",
        url: "osoite1.com",
        likes: 66
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}
