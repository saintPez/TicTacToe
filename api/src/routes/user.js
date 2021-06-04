const { Router } = require('express')

const { isAuthenticated } = require('../controllers/auth')
const {
  getUser,
  getUserIdValidation,
  getUserId,
  updateUserIdValidation,
  updateUserValidation,
  updateUserId,
  deleteUserIdValidation,
  deleteUserValidation,
  deleteUserId,
  updateDataUserValidation,
  updateData,
  updatePasswordValidation,
  updatePassword,
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
router.delete(
  '/:id',
  isAuthenticated,
  deleteUserIdValidation,
  deleteUserValidation,
  deleteUserId
)
router.post(
  '/update/user/',
  isAuthenticated,
  updateDataUserValidation,
  updateData
)
router.post(
  '/update/password/',
  isAuthenticated,
  updatePasswordValidation,
  updatePassword
)

module.exports = router
