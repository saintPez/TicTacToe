const { Router } = require('express')

const { isAuthenticated } = require('../controllers/auth')
const { isSigned, getRooms, createRoom } = require('../controllers/socket')

const router = Router()

router.get('/', isAuthenticated, isSigned, getRooms)
router.post('/', isAuthenticated, isSigned, createRoom)

module.exports = router
