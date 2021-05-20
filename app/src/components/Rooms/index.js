import io from 'socket.io-client'
import './styles.css'

const socket = io('http://localhost:3001')

function RoomsComponent() {
  let localRooms = {}

  socket.on('get-list-rooms', (data) => {
    console.log(data)
    localRooms = data
  })

  return (
    <ul className="list-rooms">
      {Object.keys(localRooms).map((singleRoom) => (
        <li key={singleRoom}>{singleRoom}</li>
      ))}
    </ul>
  )
}

export default RoomsComponent
