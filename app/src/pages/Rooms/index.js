import io from 'socket.io-client'

const socket = io('http://localhost:3000')

function Rooms() {
  return (
    <div className="Rooms">
      <ul>
        <li></li>
      </ul>
    </div>
  )
}

export default Rooms
