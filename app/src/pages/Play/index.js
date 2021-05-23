import { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'

import LoadingSpin from '../../components/LoadingSpin'

import instance from '../../axios'

import { GlobeAltIcon } from '@heroicons/react/outline'
import { UsersIcon } from '@heroicons/react/outline'
import { ClipboardListIcon } from '@heroicons/react/outline'

import './styles.css'

function Play() {
  const history = useHistory()

  const [isLoading, setIsLoading] = useState(true)
  const [, setRooms] = useState([])

  useEffect(() => {
    instance
      .get('/socket/', {
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
                    Lorem ipsum dolor sit amet
                  </div>
                </div>
              </Link>
              <Link className="play-item" to="/play/offline">
                <UsersIcon className="play-item-icon" />
                <div>
                  <div className="play-item-title">Multiplayer</div>
                  <div className="play-item-description">
                    Lorem ipsum dolor sit amet
                  </div>
                </div>
              </Link>
              <Link className="play-item" to="/rooms">
                <ClipboardListIcon className="play-item-icon" />
                <div>
                  <div className="play-item-title">Rooms</div>
                  <div className="play-item-description">
                    Lorem ipsum dolor sit amet
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
