import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'

import { setUser, updateUser, resetUser } from '../../actions/user.actions'
import instance from '../../axios'

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
          dispatch(
            setUser({
              ...response.data.user,
              access_token: cookies.Authorization,
              refresh_token: cookies.refresh_token,
            })
          )
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
    <header>
      {user.account ? (
        <>
          <a href="#user" className="item left">
            <span className="icon avatar">
              {(user.username || user.name)?.charAt(0)}
            </span>
            <span className="text">
              {user.username || user.name} ({user.score})
            </span>
          </a>
          <a href="#user" className="item">
            <HashtagIcon className="icon" />
            <span className="text">Play</span>
          </a>
          <a href="#user" className="item right">
            <BookOpenIcon className="icon" />
            <span className="text">Games</span>
          </a>
        </>
      ) : (
        <>
          <Link to="/signIn" className="item left">
            <UserIcon className="icon" />
            <span className="text">Sign In</span>
          </Link>
          <Link to="/signUp" className="item right">
            <UserAddIcon className="icon" />
            <span className="text">Sign Up</span>
          </Link>
        </>
      )}
    </header>
  )
}

export default Header
