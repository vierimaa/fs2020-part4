const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const isPasswordValid = (password) => password.length > 3 ? true : false

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  if (!isPasswordValid(body.password)){
    response.status(400).json(
      { error: 'User password must be longer than 3 characters!'}
    )
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
    
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
  
})

module.exports = usersRouter