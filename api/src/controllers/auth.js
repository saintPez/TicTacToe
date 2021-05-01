const crypto = require('crypto')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const User = require('../models/user')
const Code = require('../models/code')

const validate = require('../lib/validate')
const {
  signInSchema,
  signUpSchema,
  createCodeSchema,
  isValidCodeSchema,
  resetPasswordSchema,
} = require('../validations/auth')

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
    return next(
      createError(401, 'Incorrect email or password', { expose: true })
    )

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

  res.json({
    success: true,
    access_token,
    token_type: 'Bearer',
    expires_in: ACCESS_TOKEN_EXPIRES_IN,
    refresh_token,
    refresh_token_expires_in: REFRESH_TOKEN_EXPIRES_IN,
  })
}

// signUp

const signUpValidation = validate.body(signUpSchema)

const signUp = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (user)
    return next(createError(409, 'Email is already in use', { expose: true }))

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

  res.json({
    success: true,
    access_token,
    token_type: 'Bearer',
    expires_in: ACCESS_TOKEN_EXPIRES_IN,
    refresh_token,
    refresh_token_expires_in: REFRESH_TOKEN_EXPIRES_IN,
  })
}

// createCode

const createCodeValidation = validate.body(createCodeSchema)

const createCode = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return next(createError(404, 'User not found', { expose: true }))

  let data

  do {
    data = crypto.randomBytes(3).toString('hex')
    console.log(await Code.findOne({ data: data }))
  } while (await Code.findOne({ data: data }))

  const code = await Code.create({
    data: data,
    user: user._id,
    user_updatedAt: user.updatedAt.getTime(),
  })

  console.log(code)

  res.status(201).json({ success: true })
}

// isValidCode

const isValidCodeValidation = validate.body(isValidCodeSchema)

const isValidCode = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return next(createError(404, 'User not found', { expose: true }))
  console.log(await Code.findOne({}))
  const code = await Code.findOne({
    data: req.body.code,
    user: user._id,
    user_updatedAt: user.updatedAt.getTime(),
  })

  // send code by mail

  console.log(code)
  if (!code) return next(createError(400, 'Invalid code'))

  req.user = user._id
  req.code = code.data

  next()
}

// code

const code = (req, res) => {
  res.status(200).json({ success: true })
}

// resetPassword

const resetPasswordValidation = validate.body(resetPasswordSchema)

const resetPassword = async (req, res) => {
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(req.body.password, salt)
  await User.updateOne({ _id: req.user }, { password })

  res.status(200).json({ success: true })
}

module.exports = {
  signInValidation,
  signIn,
  signUpValidation,
  signUp,
  createCodeValidation,
  createCode,
  isValidCodeValidation,
  isValidCode,
  code,
  resetPasswordValidation,
  resetPassword,
}
