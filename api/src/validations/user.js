const Joi = require('joi')

const getUserIdSchema = Joi.object({
  id: Joi.string().min(24).max(24).required(),
})

const updateUserIdSchema = Joi.object({
  id: Joi.string().min(24).max(24).required(),
})

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(22).optional(),
  name: Joi.string().min(3).max(22).optional(),
  email: Joi.string().email().optional(),
  newPassword: Joi.string().min(5).optional(),
  admin: Joi.boolean().optional(),
  password: Joi.string().min(5).required(),
})

const updateUserDataSchema = Joi.object({
  username: Joi.string().min(3).max(22).optional(),
  name: Joi.string().min(3).max(22).optional(),
  email: Joi.string().email().optional(),
})

const updatePasswordSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

const deleteUserIdSchema = Joi.object({
  id: Joi.string().min(24).max(24).required(),
})

const deleteUserSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

module.exports = {
  getUserIdSchema,
  updateUserIdSchema,
  updateUserSchema,
  deleteUserIdSchema,
  deleteUserSchema,
  updateUserDataSchema,
  updatePasswordSchema,
}
