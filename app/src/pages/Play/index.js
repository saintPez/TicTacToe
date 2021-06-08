import { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import LoadingSpin from '../../components/LoadingSpin'

import instance from '../../axios'
import socket from '../../socket'

import { GlobeAltIcon } from '@heroicons/react/outline'
import { UsersIcon } from '@heroicons/react/outline'
import { ClipboardListIcon } from '@heroicons/react/outline'

import './styles.css'

function Play() {
  const user = useSelector((state) => state.user)
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const [, setRooms] = useState([])

  useEffect(() => {
    if (user.room) history.push('/leave')
    if (user.queue) history.push('/leave-queue')
    instance
      .get(`/socket/?socket=${socket.id}`, {
        config: { test: 'hola' },
      })
      .then((response) => {
        setRooms(response.data.rooms)
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
          <div className="main-item play">
            <h1 className="h1">Play</h1>

            <div className="play-items">
              <Link className="play-item" to="/play/online">
                <GlobeAltIcon className="play-item-icon" />
                <div>
                  <div className="play-item-title">Online</div>
                  <div className="play-item-description">
                    Play against a person with the same score as yourself
                  </div>
                </div>
              </Link>
              <Link className="play-item" to="/play/offline">
                <UsersIcon className="play-item-icon" />
                <div>
                  <div className="play-item-title">Multiplayer</div>
                  <div className="play-item-description">
                    (Offline) Play with another person from the same device
                  </div>
                </div>
              </Link>
              <Link className="play-item" to="/rooms">
                <ClipboardListIcon className="play-item-icon" />
                <div>
                  <div className="play-item-title">Rooms</div>
                  <div className="play-item-description">
                    Create games with a customized configuration
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Play
