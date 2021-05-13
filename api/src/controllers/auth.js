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
  isAuthenticatedSchema,
  createCodeSchema,
  isValidCodeSchema,
  resetPasswordSchema,
  refreshSchema,
} = require('../validations/auth')

const transporter = require('../mailer')

const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  EMAIL_USER,
} = require('../env')

// signIn

const signInValidation = validate.body(signInSchema)

const signIn = async (req, res, next) => {
  try {
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

    res.status(200).json({
      success: true,
      access_token,
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_EXPIRES_IN,
      refresh_token,
      refresh_token_expires_in: REFRESH_TOKEN_EXPIRES_IN,
    })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

// signUp

const signUpValidation = validate.body(signUpSchema)

const signUp = async (req, res, next) => {
  try {
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

    res.status(201).json({
      success: true,
      access_token,
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_EXPIRES_IN,
      refresh_token,
      refresh_token_expires_in: REFRESH_TOKEN_EXPIRES_IN,
    })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

const isAuthenticatedValidation = validate.headers(isAuthenticatedSchema)

const isAuthenticated = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    const access_token = authorization.split(' ')[1]
    const { _id, updatedAt } = await jwt.verify(
      access_token,
      ACCESS_TOKEN_SECRET
    )

    const user = await User.findOne({ _id, updatedAt })
    if (!user) return next(createError(401, 'Invalid token', { expose: true }))

    user.password = undefined

    req.user = user

    next()
  } catch (error) {
    next(createError(401, 'Invalid token', { expose: true }))
  }
}

// createCode

const createCodeValidation = validate.body(createCodeSchema)

const createCode = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(createError(404, 'User not found', { expose: true }))

    let data

    do {
      data = crypto.randomBytes(3).toString('hex')
    } while (await Code.findOne({ data: data }))

    const code = await Code.create({
      data: data,
      user: user._id,
      user_updatedAt: user.updatedAt.getTime(),
    })

    await transporter.sendMail({
      from: `"Tic-Tac-Toe - Code" <${EMAIL_USER}>`,
      to: user.email,
      subject: 'Tic-Tac-Toe - Code',
      html: `<div>${code.data}</div>`,
    })

    res.status(201).json({ success: true })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

// isValidCode

const isValidCodeValidation = validate.params(isValidCodeSchema)

const isValidCode = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email })
    if (!user) return next(createError(404, 'User not found', { expose: true }))
    const code = await Code.findOne({
      data: req.params.code,
      user: user._id,
      user_updatedAt: user.updatedAt.getTime(),
    })

    if (!code) return next(createError(400, 'Invalid code'))

    req.user = user._id
    req.code = code.data

    next()
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

// code

const code = (req, res) => {
  res.status(200).json({ success: true })
}

// resetPassword

const resetPasswordValidation = validate.body(resetPasswordSchema)

const resetPassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)
    await User.updateOne({ _id: req.user }, { password })

    res.status(200).json({ success: true })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

// refresh

const refreshValidation = validate.body(refreshSchema)

const refresh = async (req, res, next) => {
  try {
    const { refresh_token } = req.body

    const payload = jwt.decode(refresh_token)

    const user = await User.findOne({ _id: payload._id })
    if (!user)
      return next(createError(401, 'Invalid refresh token', { expose: true }))

    await jwt.verify(
      refresh_token,
      REFRESH_TOKEN_SECRET + user.updatedAt.getTime()
    )

    const access_token = await jwt.sign(
      { _id: user._id, updatedAt: user.updatedAt.getTime() },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    )
    const new_refresh_token = await jwt.sign(
      { _id: user._id },
      REFRESH_TOKEN_SECRET + user.updatedAt.getTime(),
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    )

    res.status(200).json({
      success: true,
      access_token,
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_EXPIRES_IN,
      refresh_token: new_refresh_token,
      refresh_token_expires_in: REFRESH_TOKEN_EXPIRES_IN,
    })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

module.exports = {
  signInValidation,
  signIn,
  signUpValidation,
  signUp,
  isAuthenticatedValidation,
  isAuthenticated,
  createCodeValidation,
  createCode,
  isValidCodeValidation,
  isValidCode,
  code,
  resetPasswordValidation,
  resetPassword,
  refreshValidation,
  refresh,
}
