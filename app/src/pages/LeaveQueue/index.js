import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { updateUser } from '../../actions/user.actions'

import socket from '../../socket'

import LoadingSpin from '../../components/LoadingSpin'

function LeaveQueue() {
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateUser({ queue: false }))
    socket.emit('leave-queue')
    socket.once('leave-queue', (response) => {
      if (response.success) history.push('/')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="main-item loading">
        <LoadingSpin />
      </div>
    </>
  )
}

export default LeaveQueue
