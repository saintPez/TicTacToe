const { Router } = require('express')

const { isAuthenticated } = require('../controllers/auth')
const {
  isSigned,
  getRooms,
  createRoom,
  queue,
} = require('../controllers/socket')

const router = Router()

router.get('/', isAuthenticated, isSigned, getRooms)
router.post('/', isAuthenticated, isSigned, createRoom)
router.post('/queue', isAuthenticated, isSigned, queue)

module.exports = router
