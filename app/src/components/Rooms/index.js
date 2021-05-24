import { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'

import LoadingSpin from '../../components/LoadingSpin'

import instance from '../../axios'
import socket from '../../socket'

import './styles.css'

function RoomsComponent() {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    instance
      .get('/socket/')
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
        <div className="main-item">
          <div className="rooms">
            <div className="rooms-create">
              <button
                onClick={() => {
                  instance
                    .post('/socket/', {
                      config: {
                        width: 3,
                        height: 3,
                        consecutive: 3,
                        inverted: false,
                        password: null,
                      },
                    })
                    .then((response) => {
                      socket.emit('join', response.data.room.id)
                    })
                    .catch((error) => {
                      history.push('/')
                    })
                }}
              >
                Create
              </button>
            </div>
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Players</th>
                  <th>Table</th>
                  <th>Consecutive</th>
                  <th>Inverted</th>
                  <th>Public</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1/2</td>
                  <td>3x3</td>
                  <td>3</td>
                  <td>true</td>
                  <td>true</td>
                </tr>
                <tr>
                  <td>1/4</td>
                  <td>10x10</td>
                  <td>5</td>
                  <td>false</td>
                  <td>false</td>
                </tr>
                <tr>
                  <td>3/4</td>
                  <td>10x10</td>
                  <td>5</td>
                  <td>false</td>
                  <td>true</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

export default RoomsComponent
