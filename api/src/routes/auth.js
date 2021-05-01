const { Router } = require('express')
const {
  signInValidation,
  signIn,
  signUpValidation,
  signUp,
  createCodeValidation,
  createCode,
  isValidCodeValidation,
  isValidCode,
  code,
  resetPasswordValidation,
  resetPassword,
} = require('../controllers/auth')

const router = Router()

router.post('/signin', signInValidation, signIn)
router.post('/signup', signUpValidation, signUp)
router.post('/code', createCodeValidation, createCode)
router.get('/code', isValidCodeValidation, isValidCode, code)
router.post(
  '/password',
  isValidCodeValidation,
  isValidCode,
  resetPasswordValidation,
  resetPassword
)

module.exports = router
