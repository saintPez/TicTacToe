import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useDispatch } from 'react-redux'

import { resetUser } from '../../actions/user.actions'

import socket from '../../socket'

import LoadingSpin from '../../components/LoadingSpin'

function LogOut() {
  const [, , removeCookie] = useCookies(['Authorization'])
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(resetUser())
    socket.emit('leave')
    removeCookie('refresh_token')
    removeCookie('Authorization')

    history.push('/')
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

export default LogOut
