import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import LoadingSpin from '../../components/LoadingSpin'

// import instance from '../../axios'
import socket from '../../socket'

function Room() {
  const history = useHistory()
  const { id } = useParams()
  const [room, setRoom] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    socket.emit('join', id)
    socket.once('join', (response) => {
      console.log('join', response)
      if (!response.success) return history.push('/')
      setRoom(response.room)
      setIsLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  socket.on('room', (room) => {
    console.log('room', room)
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
          </div>
        </>
      )}
    </>
  )
}

export default Room
