const { Router } = require('express')

const { isAuthenticated } = require('../controllers/auth')
const { getGamesValidation, getGames } = require('../controllers/game')

const router = Router()

router.get('/', isAuthenticated, getGamesValidation, getGames)

module.exports = router
