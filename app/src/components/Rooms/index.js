import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import LoadingSpin from '../../components/LoadingSpin'

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
        <div className="main-item">
          <div className="rooms">
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Players</th>
                  <th>Board</th>
                  <th>Consecutive</th>
                  <th>Inverted</th>
                  <th>Public</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      <Link to={`/room/${room.id}`}>
                        {room.users.length}/{room.config.players}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/room/${room.id}`}>
                        {room.config.width}x{room.config.height}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/room/${room.id}`}>
                        {room.config.consecutive}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/room/${room.id}`}
                      >{`${room.config.inverted}`}</Link>
                    </td>
                    <td>
                      <Link to={`/room/${room.id}`}>
                        {`${room.config.password == null}`}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

export default RoomsComponent
