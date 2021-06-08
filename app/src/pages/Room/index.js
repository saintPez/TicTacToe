import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { updateUser } from '../../actions/user.actions'

import LoadingSpin from '../../components/LoadingSpin'

import instance from '../../axios'
import socket from '../../socket'

import { UserCircleIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/outline'

import './styles.css'

function Room() {
  const history = useHistory()
  const { id } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [room, setRoom] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user.socket) return history.push('/')
    if (user.room) history.push('/leave')
    if (user.queue) history.push('/leave-queue')
    socket.emit('join', id)
    socket.once('join', (response) => {
      if (!response.success) return history.push('/')
      setRoom(response.room)
      setIsLoading(false)
      dispatch(updateUser({ room: true, roomId: response.room.id }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    socket.emit('ready')
    socket.once('ready', (response) => {
      if (!response.success) return history.push('/')
      if (response.room.playing) return history.push(`/play/online/${room.id}`)
      setRoom(response.room)
    })
  }

  socket.on('room', (room) => {
    if (room.playing) return history.push(`/play/online/${room.id}`)
    setRoom(room)
  })

  /*
  <div className="main-item">
            <div>{room.id}</div>
            {room.users.map((user) => (
              <div>
                <div>{user.id}</div>
                <div>{user.name}</div>
                <div>{user.ready ? 'Y' : 'N'}</div>
              </div>
            ))}
            {room.users.length === room.config.players ? (
              <button onClick={handleClick}>Go</button>
            ) : (
              <></>
            )}
          </div>
  */

  /*
  <div className="main-item">
        <div>24124249-90db-4a82-9fc9-ecfb456456df</div>
        <div>
          <div>60b2e9905247300028b63413</div>
          <div>santiagogomezsolarte</div>
          <div>{user2.ready ? 'Y' : 'N'}</div>
          <div>
            {user2.players}/{user2.config.players}
          </div>
        </div>
        {user2.players === user2.config.players ? (
          <button onClick={handleClick}>Go</button>
        ) : (
          <></>
        )}
      </div>
  */

  return (
    <>
      {isLoading ? (
        <div className="main-item loading">
          <LoadingSpin />
        </div>
      ) : (
        <div className="tab-room">
          <div className="tab-content">
            <span className="players-text">
              {room.users.length}/{room.config.players}
            </span>
          </div>
          <div className="tab-s-content">
            <div className="model-list">
              {room.users.map((user) => (
                <div className="user-model">
                  <UserCircleIcon className="user-icon" />
                  <span className="name-model">{user.name}</span>
                  <span className="ready-model">
                    {user.ready ? (
                      <CheckIcon className="check-icon" />
                    ) : (
                      <>
                        <XIcon className="none-icon" />
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
            {room.users.length === room.config.players ? (
              <button className="ready-btn" onClick={handleClick}>
                Play
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Room
