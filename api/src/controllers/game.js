const bcrypt = require('bcrypt')
const createError = require('http-errors')

const User = require('../models/user')
const Game = require('../models/game')

const validate = require('../lib/validate')
const {
  getGamesSchema,
  getGameIdSchema,
  deleteGameIdSchema,
  deleteGameSchema,
} = require('../validations/game')

const getGamesValidation = validate.query(getGamesSchema)

const getGames = async (req, res, next) => {
  try {
    const _limit = parseInt(req.query.limit)
    const _offset = parseInt(req.query.offset)

    const limit = _limit > 0 && _limit < 25 ? _limit : 25
    const offset = _offset > 0 ? _offset : 0

    console.log('limit', limit)
    console.log('offset', offset)

    const countDocuments = await Game.countDocuments()

    const last_document = offset + limit >= countDocuments ? -1 : offset + limit

    const game = await Game.find({}, null, {
      skip: offset,
      limit: limit,
    })

    res.status(200).json({ success: true, game, last_document })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

const getGameIdValidation = validate.params(getGameIdSchema)

const getGameId = async (req, res, next) => {
  try {
    const game = await Game.findOne({ _id: req.params.id })
    if (!game) return next(createError(404, 'Game not found', { expose: true }))

    res.status(200).json({ success: true, game })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

const deleteGameIdValidation = validate.params(deleteGameIdSchema)
const deleteGameValidation = validate.body(deleteGameSchema)

const deleteGame = async (req, res, next) => {
  try {
    const account = await User.findOne({ _id: req.user._id })
    if (
      !req.user.admin ||
      !(await bcrypt.compare(req.body.password, account?.password))
    )
      return next(createError(403, 'Access denied', { expose: true }))

    await Game.deleteOne({ _id: req.params.id })

    res.status(200).json({ success: true })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

module.exports = {
  getGamesValidation,
  getGames,
  getGameIdValidation,
  getGameId,
  deleteGameIdValidation,
  deleteGameValidation,
  deleteGame,
}
