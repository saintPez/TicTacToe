const { Router } = require('express')

const { isAuthenticated } = require('../controllers/auth')
const { getRooms, createRoom } = require('../controllers/socket')

const router = Router()

router.get('/', isAuthenticated, getRooms)
router.post('/', isAuthenticated, createRoom)

module.exports = router
