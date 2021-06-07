import { useEffect, useState } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { DateTime } from 'luxon'

import LoadingSpin from '../../components/LoadingSpin'

import { CalendarIcon } from '@heroicons/react/solid'
import { HeartIcon } from '@heroicons/react/solid'
import { HashtagIcon } from '@heroicons/react/solid'

import instance from '../../axios'

import './styles.css'

function User() {
  const history = useHistory()
  const { id } = useParams()
  const _user = useSelector((state) => state.user)
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (_user.room) history.push('/leave')
    if (_user.queue) history.push('/leave-queue')
    instance
      .get(`/user/${id}`)
      .then((response) => {
        setUser({ ...response.data.user })
        setIsLoading(false)
      })
      .catch((error) => {
        history.push('/')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="main-item loading">
          <LoadingSpin />
        </div>
      ) : (
        <>
          <div className="main-item-user">
            <div className="user-header">
              <div className="user-header-avatar">
                {(user.username || user.name)?.charAt(0)}
              </div>
            </div>
            <div className="user-body">
              <h1 className="h1 user-body-username">
                {user.username ? user.username : user.name}
              </h1>
              <div className="user-body-data">
                {user.username ? (
                  <div className="user-body-name">{user.name} </div>
                ) : (
                  <></>
                )}
                <div className="user-body-email">{user.email} </div>
              </div>
              <div className="user-body-info">
                <div className="user-body-info-item">
                  <CalendarIcon className="user-body-info-item-icon" />
                  <div className="user-body-info-item-data">
                    {`${DateTime.fromISO(user.createdAt).toFormat(
                      'MM/dd/yyyy'
                    )}`}
                  </div>
                </div>
                <div className="user-body-info-item">
                  <HeartIcon className="user-body-info-item-icon" />
                  <div className="user-body-info-item-data">
                    {user.games.filter((game) => game.result === true).length}
                  </div>
                </div>
                <div className="user-body-info-item user-body-info-item-third">
                  <HashtagIcon className="user-body-info-item-icon" />
                  <div className="user-body-info-item-data">{user.score}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="main-item">
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>win</th>
                </tr>
              </thead>
              <tbody>
                {user.games
                  .map((game) => (
                    <tr key={game.data}>
                      <td>
                        <Link to={`/game/${game.data}`}>{game.data}</Link>
                      </td>
                      <td>
                        <Link to={`/game/${game.data}`}>
                          {`${game.result}` === 'undefined'
                            ? ''
                            : `${game.result}`}
                        </Link>
                      </td>
                    </tr>
                  ))
                  .reverse()}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

export default User
