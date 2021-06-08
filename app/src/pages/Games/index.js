import { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import LoadingSpin from '../../components/LoadingSpin'
import { CheckIcon } from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/outline'

import instance from '../../axios'

import './styles.css'

function Games() {
  const history = useHistory()
  const user = useSelector((state) => state.user)
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user.room) history.push('/leave')
    if (user.queue) history.push('/leave-queue')
    instance
      .get('/game/')
      .then((response) => {
        setGames(response.data.game)
        setIsLoading(false)
      })
      .catch((error) => {
        history.push('/')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="main-item loading">
          <LoadingSpin />
        </div>
      ) : (
        <div className="rooms">
          {games.map((game) => (
            <Link to={`/game/${game._id}`} key={game.id}>
              <div className="room-item">
                <div className="room-content">
                  <div className="main-1t">
                    <span className="t-span">Board</span>
                    <span className="board-span">
                      {`${game.board.width}x${game.board.height}`}
                    </span>
                  </div>
                  <div className="main-2t">
                    <span className="t-span">Players</span>
                    <span className="players-span">{game.players.length}</span>
                  </div>
                  <div className="main-1t">
                    <span className="t-span">Consecutive</span>
                    <span className="board-span">{game.board.consecutive}</span>
                  </div>
                  <div className="main-2t">
                    <span className="t-span">Inverted</span>
                    <span className="players-span">
                      {game.board.inverted ? (
                        <CheckIcon className="check-icon" />
                      ) : (
                        <XIcon className="none-icon" />
                      )}
                    </span>
                  </div>
                  <div className="main-1t">
                    <span className="t-span">Winner</span>
                    <span className="players-span">
                      {`${game.result}` === 'undefined' ? '' : `${game.result}`}
                    </span>
                  </div>
                </div>
                <div className="main-3t">
                  <button className="btn-play">Watch</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default Games
