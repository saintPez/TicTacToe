const { Router } = require('express')
const {
  signInValidation,
  signIn,
  signUpValidation,
  signUp,
} = require('../controllers/auth')

const router = Router()

router.post('/signin', signInValidation, signIn)
router.post('/signup', signUpValidation, signUp)

module.exports = router
