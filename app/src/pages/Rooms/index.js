import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import RoomsComponent from '../../components/Rooms'
import CreateTable from '../../components/CreateTable'

import instance from '../../axios'

import './styles.css'

function Rooms() {
  const history = useHistory()
  const user = useSelector((state) => state.user)
  const [config, setConfig] = useState({
    width: 10,
    height: 10,
    consecutive: 5,
    players: 2,
    inverted: false,
    password: null,
  })

  useEffect(() => {
    if (!user.socket) history.push('/home')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlerClick = () => {
    instance
      .post(`/socket/?socket=${user.socketId}`, {
        config: {
          ...config,
        },
      })
      .then((response) => {
        history.push(`/room/${response.data.room.id}`)
      })
      .catch((error) => {
        history.push('/')
      })
  }

  return (
    <>
      <div className="main-item">
        <div className="rooms-create">
          <CreateTable config={config} setConfig={setConfig} />
          <div>
            <h1>{`${config.width}x${config.height}`}</h1>
            <div>Consecutive</div>
            <select
              name="consecutive"
              value={config.consecutive}
              onChange={(e) => {
                setConfig({ ...config, consecutive: parseInt(e.target.value) })
              }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <div>Players</div>
            <select
              name="consecutive"
              value={config.players}
              onChange={(e) => {
                setConfig({ ...config, players: parseInt(e.target.value) })
              }}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <div>Inverted</div>
            <input
              type="checkbox"
              checked={config.inverted}
              onChange={() => {
                setConfig({ ...config, inverted: !config.inverted })
              }}
            />
            <button onClick={handlerClick}>Create</button>
          </div>
        </div>
      </div>
      <RoomsComponent />
    </>
  )
}

export default Rooms

// <div className="rooms-create">
//   <button
//     onClick={() => {
//       instance
//         .post(`/socket/?socket=${socket.id}`, {
//           config: {
//             width: 3,
//             height: 3,
//             consecutive: 3,
//             inverted: false,
//             password: null,
//             players: 2,
//           },
//         })
//         .then((response) => {
//           history.push(`/room/${response.data.room.id}`)
//         })
//         .catch((error) => {
//           history.push('/')
//         })
//     }}
//   >
//     Create
//   </button>
// </div>
