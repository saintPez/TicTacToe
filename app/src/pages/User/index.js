import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import LoadingSpin from '../../components/LoadingSpin'

import { CalendarIcon } from '@heroicons/react/solid'
import { HeartIcon } from '@heroicons/react/solid'
import { HashtagIcon } from '@heroicons/react/solid'

import instance from '../../axios'

import './styles.css'

function User() {
  const history = useHistory()
  const { id } = useParams()
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    instance
      .get(`/user/${id}`)
      .then((response) => {
        setUser({ ...response.data.user })
        setIsLoading(false)
        console.log({ ...user })
      })
      .catch((error) => {
        // history.push('/')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //<LoadingSpin />

  return (
    <>
      {isLoading ? (
        <div className="main-item user-loading">
          <div className="main-item-user">
            <div className="user-header">
              <div className="user-header-avatar">S</div>
            </div>
            <div className="user-body">
              <h1 className="h1 user-body-username">santiagogomezsolarte</h1>
              <div className="user-body-data">
                {user.username ? (
                  <div className="user-body-name">Santiago Gómez Solarte </div>
                ) : (
                  <></>
                )}
                <div className="user-body-email">
                  santiagogomezsolarte@gmail.com{' '}
                </div>
              </div>
              <div className="user-body-info">
                <div className="user-body-info-item">
                  <CalendarIcon className="user-body-info-item-icon" />
                  <div className="user-body-info-item-data">19/05/2021</div>
                </div>
                <div className="user-body-info-item">
                  <HeartIcon className="user-body-info-item-icon" />
                  <div className="user-body-info-item-data">10</div>
                </div>
                <div className="user-body-info-item">
                  <HashtagIcon className="user-body-info-item-icon" />
                  <div className="user-body-info-item-data">10</div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-item">PARTIDAS</div>
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
                  <div className="user-body-info-item-data">19/05/2021</div>
                </div>
                <div className="user-body-info-item">
                  <HeartIcon className="user-body-info-item-icon" />
                  <div className="user-body-info-item-data">{user.score}</div>
                </div>
                <div className="user-body-info-item">
                  <HashtagIcon className="user-body-info-item-icon" />
                  <div className="user-body-info-item-data">{user.score}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-item">PARTIDAS</div>
        </>
      )}
    </>
  )
}

export default User
