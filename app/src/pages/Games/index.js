import { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import LoadingSpin from '../../components/LoadingSpin'

import instance from '../../axios'

function Games() {
  const history = useHistory()
  const user = useSelector((state) => state.user)
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user.room) history.push('/leave')
    instance
      .get('/game/')
      .then((response) => {
        console.log(response)
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
        <div className="main-item">
          <table className="rooms-table">
            <thead>
              <tr>
                <th>Players</th>
                <th>Board</th>
                <th>Consecutive</th>
                <th>Inverted</th>
                <th>Win</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td>
                    <Link to={`/game/${game._id}`}>{game.players.length}</Link>
                  </td>
                  <td>
                    <Link
                      to={`/game/${game._id}`}
                    >{`${game.board.width}x${game.board.height}`}</Link>
                  </td>
                  <td>
                    <Link to={`/game/${game._id}`}>
                      {game.board.consecutive}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/game/${game._id}`}
                    >{`${game.board.inverted}`}</Link>
                  </td>
                  <td>
                    <Link to={`/game/${game._id}`}>
                      {`${game.result}` === 'undefined' ? '' : `${game.result}`}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Games
