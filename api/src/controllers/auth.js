const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const User = require('../models/user')

const validate = require('../lib/validate')
const { signInSchema, signUpSchema } = require('../validations/auth')

const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
} = require('../env')

// signIn

const signInValidation = validate.body(signInSchema)

const signIn = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user || !(await bcrypt.compare(req.body.password, user?.password)))
    return next(createError(401, 'Incorrect email or password'))

  user.password = undefined

  const access_token = await jwt.sign(
    { _id: user._id, updatedAt: user.updatedAt.getTime() },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  )
  const refresh_token = await jwt.sign(
    { _id: user._id },
    REFRESH_TOKEN_SECRET + user.updatedAt.getTime(),
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  )

  res.json({ user, access_token, refresh_token })
}

// signUp

const signUpValidation = validate.body(signUpSchema)

const signUp = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) return next(createError(409, 'Email is already in use'))

  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(req.body.password, salt)

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password,
  })

  const access_token = await jwt.sign(
    { _id: newUser._id, updatedAt: newUser.updatedAt.getTime() },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  )
  const refresh_token = await jwt.sign(
    { _id: newUser._id },
    REFRESH_TOKEN_SECRET + newUser.updatedAt.getTime(),
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  )

  res.json({ user: newUser, access_token, refresh_token })
}

module.exports = {
  signInValidation,
  signIn,
  signUpValidation,
  signUp,
}
