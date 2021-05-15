const Joi = require('joi')

const getGamesSchema = Joi.object({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

module.exports = {
  getGamesSchema,
}
