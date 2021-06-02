import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useDispatch } from 'react-redux'

import { updateUser } from '../../actions/user.actions'

import LoadingSpin from '../../components/LoadingSpin'
import Table from '../../components/Table'

import socket from '../../socket'

function PlayOnlineGame() {
  const dispatch = useDispatch()
  const [, setCookie] = useCookies(['Authorization'])
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
    socket.emit('game-set', { width, height })
    socket.once('game-set', (response) => {
      if (response.success) setGame(response.game)
    })
  }

  socket.on('game', (game) => {
    if (game.account) {
      const now = new Date()
      setCookie('Authorization', game.account.access_token, {
        path: '/',
        expires: new Date(now.getTime() + game.account.expires_in * 1000),
      })
      setCookie('refresh_token', game.account.refresh_token, {
        path: '/',
        expires: new Date(
          now.getTime() + game.account.refresh_token_expires_in * 1000
        ),
      })
      dispatch(updateUser({ room: false, roomId: undefined }))
      socket.emit('leave')
    }
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
            game.inverted ? (
              <div>
                <div>Lose</div>
                <div>{game.win.name}</div>
              </div>
            ) : (
              <div>
                <div>Win</div>
                <div>{game.win.name}</div>
              </div>
            )
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  )
}

export default PlayOnlineGame
