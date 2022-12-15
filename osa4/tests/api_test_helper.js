const Blog = require('../models/blog')
const User = require('../models/user')



const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}
const getAuthToken = async (api) => {
    const { username, password } = initialUsers[1]
    const loginResponse = await api
        .post('/api/login')
        .send({
            username: username,
            password: password
        })
    return loginResponse.body.token
}
const initialUsers = [
    {
        username: "testi 1",
        name: "testi 1",
        password: "testi 1",
    },
    {
        username: "testi 2",
        name: "testi 2",
        password: "testi 2",
    }
]
const initialBlogs = [
    {
        title: "otsikko",
        author: "autori",
        url: "osoite.com",
        likes: 20,
        user: undefined
    }, {
        title: "otsikko1",
        author: "autori1",
        url: "osoite1.com",
        likes: 66,
        user: undefined
    }
]
module.exports = {
    initialUsers, initialBlogs, blogsInDb, usersInDb, getAuthToken
}
