const Joi = require('joi')

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
})

const signUpSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
})

const createCodeSchema = Joi.object({
  email: Joi.string().email().required(),
})

const isValidCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().min(6).max(6).required(),
})

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

module.exports = {
  signInSchema,
  signUpSchema,
  createCodeSchema,
  isValidCodeSchema,
  resetPasswordSchema,
}
