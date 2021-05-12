const { Router } = require('express')

const { isAuthenticated } = require('../controllers/auth')
const {
  getUser,
  getUserIdValidation,
  getUserId,
  updateUserIdValidation,
  updateUserValidation,
  updateUserId,
} = require('../controllers/user')

const router = Router()

router.get('/', isAuthenticated, getUser)
router.get('/:id', isAuthenticated, getUserIdValidation, getUserId)
router.put(
  '/:id',
  isAuthenticated,
  updateUserIdValidation,
  updateUserValidation,
  updateUserId
)

module.exports = router
