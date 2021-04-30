const validate = require('../lib/validate')
const { signInSchema, signUpSchema } = require('../validations/auth')

// signIn

const signInValidation = validate.body(signInSchema)

const signIn = (req, res) => {
  res.json({})
}

// signUp

const signUpValidation = validate.body(signUpSchema)

const signUp = (req, res) => {
  res.json({})
}

module.exports = {
  signInValidation,
  signIn,
  signUpValidation,
  signUp,
}
