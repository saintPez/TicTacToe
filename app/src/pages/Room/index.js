import socket from 'socket.io-client'
import { useEffect, useState } from 'react'
import './styles.css'
import { useSelector } from 'react-redux'

const io = socket('http://localhost:3000')

function Room() {
  const room = useSelector((state) => state.room)
  const [localRooms, setLocalRooms] = useState([])
  const [data, setData] = useState({
    roomName: '',
  })

  useEffect(() => {
    io.on('new-room-created', (data) => {
      setLocalRooms(data)
    })
  }, [])

  const handleCreateRoom = (e) => {
    e.preventDefault()

    if (!data.roomName) io.emit('new-room', data.roomName)
  }

  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="room">
      <form className="CRoomForm" onSubmit={handleCreateRoom}>
        <input
          type="text"
          name="roomName"
          placeholder="Nombre de sala"
          onChange={handleInputChange}
        />

        <button className="create-room" type="submit">
          Crear sala
        </button>
      </form>
    </div>
  )
}

export default Room
