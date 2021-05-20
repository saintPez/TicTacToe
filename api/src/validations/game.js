const Joi = require('joi')

const getGamesSchema = Joi.object({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

const getGameIdSchema = Joi.object({
  id: Joi.string().min(24).max(24).required(),
})

const createGameSchema = Joi.object({
  players: Joi.array().min(2).items(Joi.string().min(24).max(24)).required(),
  history: Joi.array().min(5).items(Joi.number()).required(),
  board: Joi.object()
    .keys({
      width: Joi.number().min(3).max(12).required(),
      height: Joi.number().min(3).max(12).required(),
      consecutive: Joi.number().min(3).max(6).required(),
      inverted: Joi.boolean().optional(),
    })
    .required(),
  result: Joi.string().min(24).max(24).required(),
})

const deleteGameIdSchema = Joi.object({
  id: Joi.string().min(24).max(24).required(),
})

const deleteGameSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

module.exports = {
  getGamesSchema,
  getGameIdSchema,
  createGameSchema,
  deleteGameIdSchema,
  deleteGameSchema,
}
