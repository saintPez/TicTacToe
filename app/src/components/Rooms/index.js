import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import LoadingSpin from '../../components/LoadingSpin'
import { CheckIcon } from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/outline'

import instance from '../../axios'
import socket from '../../socket'

import './styles.css'

function RoomsComponent() {
  const [isLoading, setIsLoading] = useState(true)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    instance
      .get(`/socket/?socket=${socket.id}`)
      .then((response) => {
        setRooms(response.data.rooms)
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="main-item loading">
          <LoadingSpin />
        </div>
      ) : (
        <div className="rooms">
          {rooms.map((room) => (
            <Link to={`/room/${room.id}`}>
              <div className="room-item" key={room.id}>
                <div className="room-content">
                  <div className="main-1t">
                    <span className="t-span">Board</span>
                    <span className="board-span">
                      {room.config.width}x{room.config.height}
                    </span>
                  </div>
                  <div className="main-2t">
                    <span className="t-span">Players</span>
                    <span className="players-span">
                      {room.users.length}/{room.config.players}
                    </span>
                  </div>
                  <div className="main-1t">
                    <span className="t-span">Consecutive</span>
                    <span className="board-span">
                      {room.config.consecutive}
                    </span>
                  </div>
                  <div className="main-2t">
                    <span className="t-span">Inverted</span>
                    <span className="players-span">
                      {room.config.inverted ? (
                        <CheckIcon className="check-icon" />
                      ) : (
                        <XIcon className="none-icon" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="main-3t">
                  <button className="btn-play">Play</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default RoomsComponent
