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

module.exports = {
  signInSchema,
  signUpSchema,
}
