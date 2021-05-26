import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'

import { setUser, updateUser, resetUser } from '../../actions/user.actions'

import instance from '../../axios'
import socket from '../../socket'

import { HashtagIcon } from '@heroicons/react/solid'
import { BookOpenIcon, UserIcon, UserAddIcon } from '@heroicons/react/outline'

import './styles.css'

function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(['Authorization'])
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (cookies.Authorization) {
      instance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${cookies.Authorization}`
      instance
        .get('/user')
        .then((response) => {
          socket.emit('signIn', {
            id: response.data.user._id,
            name: response.data.user.username || response.data.user.name,
          })
          socket.once('signIn', (socketResponse) => {
            dispatch(
              setUser({
                ...response.data.user,
                socket: socketResponse.success,
                socketId: socket.id,
                access_token: cookies.Authorization,
                refresh_token: cookies.refresh_token,
              })
            )
          })
        })
        .catch((error) => {
          removeCookie('Authorization')
          console.log(error.response?.data)
        })
    } else if (cookies.refresh_token) {
      instance
        .post('/auth/refresh', {
          refresh_token: cookies.refresh_token,
        })
        .then((response) => {
          const now = new Date()
          setCookie('Authorization', response.data.access_token, {
            path: '/',
            expires: new Date(now.getTime() + response.data.expires_in * 1000),
          })
          setCookie('refresh_token', response.data.refresh_token, {
            path: '/',
            expires: new Date(
              now.getTime() + response.data.refresh_token_expires_in * 1000
            ),
          })
          dispatch(
            updateUser({
              access_token: cookies.Authorization,
              refresh_token: cookies.refresh_token,
            })
          )
        })
        .catch((error) => {
          removeCookie('refresh_token')
          dispatch(resetUser())
          console.log(error.response?.data)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.Authorization])

  return (
    <header className="header">
      {user.account ? (
        <>
          <Link
            to={`/user/${user._id}`}
            className="header-item header-item-left"
          >
            <span className="header-item-icon header-item-avatar">
              {(user.username || user.name)?.charAt(0)}
            </span>
            <span className="header-item-text">
              {user.username || user.name} ({user.score})
            </span>
          </Link>

          <Link to={`/play`} className="header-item">
            <HashtagIcon className="header-item-icon" />
            <span className="header-item-text">Play</span>
          </Link>
          <a href="#user" className="header-item header-item-right">
            <BookOpenIcon className="header-item-icon" />
            <span className="header-item-text">Games</span>
          </a>
        </>
      ) : (
        <>
          <Link to="/signIn" className="header-item header-item-left">
            <UserIcon className="header-item-icon" />
            <span className="header-item-text">Sign In</span>
          </Link>
          <Link to="/signUp" className="header-item header-item-right">
            <UserAddIcon className="header-item-icon" />
            <span className="header-item-text">Sign Up</span>
          </Link>
        </>
      )}
    </header>
  )
}

export default Header
