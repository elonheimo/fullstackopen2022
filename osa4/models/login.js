const json_web_token = require('jsonwebtoken')
const bryct = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username })

    const passwordCorrect = (user === null)
        ? false
        : await bryct.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json(
            { error: 'invalid password or username' }
        )
    }
    const token = json_web_token.sign(
        { username: user.username, id: user.id },
        process.env.SECRET
    )

    response
        .status(200)
        .send({
            token,
            username: user.username,
            name: user.name
        })
})

module.exports = loginRouter