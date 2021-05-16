const { Router } = require('express')

const { isAuthenticated } = require('../controllers/auth')
const {
  getGamesValidation,
  getGames,
  getGameIdValidation,
  getGameId,
  deleteGameIdValidation,
  deleteGameValidation,
  deleteGame,
} = require('../controllers/game')

const router = Router()

router.get('/', isAuthenticated, getGamesValidation, getGames)
router.get('/:id', isAuthenticated, getGameIdValidation, getGameId)
router.delete(
  '/:id',
  isAuthenticated,
  deleteGameIdValidation,
  deleteGameValidation,
  deleteGame
)

module.exports = router
