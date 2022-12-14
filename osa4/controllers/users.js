const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('notes', { content: 1, date: 1 })
    response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json(
            { error: 'username not unique' }
        )
    }

    if (!password || password.length < 3) {

        return response.status(400).json(
            { error: 'password shoulbe 3 characters or longer' }
        )
    }

    const passwordHash = await bcrypt.hash(
        password,
        10 //saltrounds
    )
    const userForsave = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await userForsave.save()
    response.status(201).json(savedUser)

})

module.exports = usersRouter
