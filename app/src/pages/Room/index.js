import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { updateUser } from '../../actions/user.actions'

import LoadingSpin from '../../components/LoadingSpin'

// import instance from '../../axios'
import socket from '../../socket'

function Room() {
  const history = useHistory()
  const { id } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [room, setRoom] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user.socket) return history.push('/')
    if (user.room) return history.push('/')
    socket.emit('join', id)
    socket.once('join', (response) => {
      console.log('join', response)
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
    console.log('room', room)
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
        <>
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
        </>
      )}
    </>
  )
}

export default Room
