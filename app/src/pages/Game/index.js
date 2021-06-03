import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import LoadingSpin from '../../components/LoadingSpin'

import Table from '../../components/Table'

import instance from '../../axios'

function Game() {
  const history = useHistory()
  const { id } = useParams()
  const user = useSelector((state) => state.user)
  const [game, setGame] = useState({})
  const [gameHistory, setGameHistory] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user.room) history.push('/leave')
    instance
      .get(`/game/${id}`)
      .then((response) => {
        setGame({ ...response.data.game })
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error.response)
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
            <button onClick={() => nextHistory(false)}>{'<'}</button>
            <button onClick={() => nextHistory(true)}>{'>'}</button>
          </div>
        </div>
      )}
    </>
  )
}

export default Game
