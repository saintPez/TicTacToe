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
  refreshValidation,
  refresh,
} = require('../controllers/auth')

const router = Router()

router.post('/signin', signInValidation, signIn)
router.post('/signup', signUpValidation, signUp)
router.post('/code', createCodeValidation, createCode)
router.get('/code/:email/:code', isValidCodeValidation, isValidCode, code)
router.post(
  '/password/:email/:code',
  isValidCodeValidation,
  isValidCode,
  resetPasswordValidation,
  resetPassword
)
router.post('/refresh', refreshValidation, refresh)

module.exports = router
