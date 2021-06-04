const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const User = require('../models/user')

const validate = require('../lib/validate')
const {
  getUserIdSchema,
  updateUserIdSchema,
  updateUserSchema,
  deleteUserIdSchema,
  deleteUserSchema,
  updatePasswordSchema,
  updateUserDataSchema,
} = require('../validations/user')

const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
} = require('../env')

const getUser = async (req, res, next) => {
  try {
    const user = req.user
    res.status(200).json({ success: true, user })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

const getUserIdValidation = validate.params(getUserIdSchema)

const getUserId = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    if (!user) return next(createError(404, 'User not found', { expose: true }))

    user.password = undefined

    res.status(200).json({ success: true, user })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

const updateUserIdValidation = validate.params(updateUserIdSchema)
const updateUserValidation = validate.body(updateUserSchema)

const updateUserId = async (req, res, next) => {
  try {
    const account = await User.findOne({ _id: req.user._id })
    if (
      (!req.user.admin && `${req.user._id}` !== `${req.params.id}`) ||
      !(await bcrypt.compare(req.body.password, account?.password))
    )
      return next(createError(403, 'Access denied', { expose: true }))

    const update = req.body

    delete update.password
    delete update.games
    delete update.score

    if (update.newPassword) {
      const salt = await bcrypt.genSalt(10)
      update.password = await bcrypt.hash(update.newPassword, salt)
      delete update.newPassword
    }

    if (!req.user.admin) delete update.admin

    await User.updateOne({ _id: req.params.id }, { $set: { ...update } })

    if (`${req.user._id}` === `${req.params.id}`) {
      const user = await User.findOne({ _id: req.params.id })

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
    } else {
      res.status(200).json({ success: true })
    }
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

const deleteUserIdValidation = validate.params(deleteUserIdSchema)
const deleteUserValidation = validate.body(deleteUserSchema)

const deleteUserId = async (req, res, next) => {
  try {
    const account = await User.findOne({ _id: req.user._id })
    if (
      !req.user.admin ||
      !(await bcrypt.compare(req.body.password, account?.password))
    )
      return next(createError(403, 'Access denied', { expose: true }))

    await User.deleteOne({ _id: req.params.id })

    res.status(200).json({ success: true })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

//Update data

const updateDataUserValidation = validate.body(updateUserDataSchema)

const updateData = async (req, res, next) => {
  try {
    const name = req.body.name
    const email = req.body.email
    const username = req.body.username

    const emailCheck = await User.findOne({ email: email })

    if (emailCheck)
      return next(createError(409, 'Email is already in use', { expose: true }))

    await User.updateOne(
      { __id: req.user },
      { name: name, email: email, username: username }
    )

    res.status(200).json({ success: true })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

//Update password

const updatePasswordValidation = validate.body(updatePasswordSchema)

const updatePassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)
    await User.updateOne({ _id: req.user }, { password })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

module.exports = {
  getUser,
  getUserIdValidation,
  getUserId,
  updateUserIdValidation,
  updateUserValidation,
  updateUserId,
  deleteUserIdValidation,
  deleteUserValidation,
  deleteUserId,
  updateDataUserValidation,
  updateData,
  updatePasswordValidation,
  updatePassword,
}
