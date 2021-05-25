import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import RoomsComponent from '../../components/Rooms'

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

  return (
    <>
      <div className="main-item">
        <div className="rooms-create">
          <div className="rooms-create-table">{createTable()}</div>
        </div>
      </div>
      <RoomsComponent />
    </>
  )
}

function createTable() {
  const table = []
  for (let i = 0; i < 11; i++) {
    for (let a = 0; a < 11; a++) {
      if (i === 0 || a === 0) {
        if (a === 0) {
          if (i === 0) table.push(<div>{` `}</div>)
          else table.push(<div>{i}</div>)
        } else table.push(<div>{a}</div>)
      } else {
        table.push(
          <button
            id={`${i + 1}x${a + 1}`}
            className="rooms-create-table-item"
            disabled={i < 4 && a < 4 && !(i === 3 && a === 3) ? true : false}
            // autoFocus={i === 2 && i === 2 ? true : false}
          >{` `}</button>
        )
      }
    }
  }

  return table
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
