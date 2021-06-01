import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import LoadingSpin from '../../components/LoadingSpin'
import Table from '../../components/Table'

import socket from '../../socket'

function PlayOnlineGame() {
  const [isLoading, setIsLoading] = useState(true)
  const history = useHistory()
  const [game, setGame] = useState({})

  useEffect(() => {
    socket.emit('game-ready')
    socket.once('game-ready', (response) => {
      if (!response.success) return history.push('/')
      setGame(response.game)
      setIsLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (width, height) => {
    console.log()
    socket.emit('game-set', { width, height })
    socket.once('game-set', (response) => {
      if (response.success) setGame(response.game)
      console.log(response)
    })
  }

  socket.on('game', (game) => {
    console.log(game)
    setGame(game)
  })

  return (
    <>
      {isLoading ? (
        <div className="loading">
          <LoadingSpin />
        </div>
      ) : (
        <div className="main-item">
          <div className="play-online">
            <Table
              width={game.config?.width}
              height={game.config?.height}
              handleClick={handleClick}
              history={game.history}
            />
          </div>
          {game.win ? (
            <div>
              <div>Win</div>
              <div>{game.win.name}</div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  )
}

export default PlayOnlineGame
