import { useEffect, useState } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import LoadingSpin from '../../components/LoadingSpin'

import Table from '../../components/Table'

import instance from '../../axios'

import './styles.css'

function Game() {
  const history = useHistory()
  const { id } = useParams()
  const user = useSelector((state) => state.user)
  const [game, setGame] = useState({})
  const [gameHistory, setGameHistory] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user.room) history.push('/leave')
    if (user.queue) history.push('/leave-queue')
    instance
      .get(`/game/${id}`)
      .then((response) => {
        const players = []
        for (const user of response.data.game.players) {
          instance
            .get(`/user/${user}`)
            .then((_response) => {
              players.push({ ..._response.data.user })
              setGame({ ...response.data.game, users: [...players] })
              setIsLoading(false)
            })
            .catch((error) => {
              history.push('/')
            })
        }
      })
      .catch((error) => {
        history.push('/')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nextHistory = (next) => {
    let _gameHistory = gameHistory
    if (next) {
      _gameHistory = _gameHistory + 1

      if (_gameHistory >= game.history.length)
        _gameHistory = game.history.length
    } else {
      _gameHistory = _gameHistory - 1

      if (_gameHistory <= 0) _gameHistory = 0
    }
    setGameHistory(_gameHistory)
  }

  return (
    <>
      {isLoading ? (
        <div className="main-item loading">
          <LoadingSpin />
        </div>
      ) : (
        <div className="main-item">
          <div className="game-board">
            <Table
              width={game.board.width}
              height={game.board.height}
              handleClick={() => {}}
              history={[...game.history].splice(0, gameHistory)}
            />
          </div>
          <div className="game-action">
            <button
              className="game-action-button button"
              onClick={() => nextHistory(false)}
            >
              {'<'}
            </button>
            <button
              className="game-action-button button"
              onClick={() => nextHistory(true)}
            >
              {'>'}
            </button>
          </div>
          <div className="game-info"></div>
          <div className="game-players">
            {game.users.map((user) => (
              <Link
                key={`${user._id}`}
                to={`/user/${user._id}`}
                className="game-user"
              >
                <span className="game-user-avatar">
                  {(user.username || user.name)?.charAt(0)}
                </span>
                <span>
                  {user.username || user.name} ({user.score})
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Game
