import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import socket from '../../socket'

function PlayOnlineGame() {
  const history = useHistory()
  const [game, setGame] = useState({})

  useEffect(() => {
    socket.emit('game-ready')
    socket.once('game-ready', (response) => {
      if (!response.success) return history.push('/')
      setGame(response.game)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="main-item">{game.id}</div>
    </>
  )
}

export default PlayOnlineGame
