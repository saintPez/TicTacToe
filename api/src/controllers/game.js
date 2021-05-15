const createError = require('http-errors')

const Game = require('../models/game')

const validate = require('../lib/validate')
const { getGamesSchema } = require('../validations/game')

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

module.exports = {
  getGamesValidation,
  getGames,
}
