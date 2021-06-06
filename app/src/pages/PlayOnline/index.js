import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { updateUser } from '../../actions/user.actions'

import LoadingSpin from '../../components/LoadingSpin'

import instance from '../../axios'
import socket from '../../socket'

function PlayOnline() {
  const history = useHistory()
  const user = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user.account) history.push('/home')
    if (user.room) history.push('/leave')

    instance
      .post(`/socket/queue?socket=${user.socketId}`)
      .then((response) => {
        socket.emit('queue')
        dispatch(updateUser({ queue: true }))
      })
      .catch((error) => {
        history.push('/home')
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  socket.once('queue', (room) => {
    setIsLoading(true)
    history.push(`/room/${room.id}`)
  })

  return (
    <>
      {isLoading ? (
        <div className="main-item loading">
          <LoadingSpin />
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default PlayOnline
