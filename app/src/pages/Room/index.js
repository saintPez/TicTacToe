import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { updateUser } from '../../actions/user.actions'

import LoadingSpin from '../../components/LoadingSpin'

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
                  <span className="name-model">{`${user.name} ${
                    user.score || ''
                  }`}</span>
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
