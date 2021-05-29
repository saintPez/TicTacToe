// import socket from 'socket.io-client'
// import { useEffect, useState } from 'react'
// import './styles.css'

// const io = socket('http://localhost:3001')

function CreateRoom() {
  // const [localRooms, setLocalRooms] = useState([])
  // const [data, setData] = useState({
  //   roomName: '',
  // })

  // useEffect(() => {
  //   io.on('new-room-created', (data) => {
  //     setLocalRooms(data)
  //   })
  // }, [])

  // const handleCreateRoom = (e) => {
  //   e.preventDefault()

  //   if (!data.roomName) {
  //     alert('Debe ingresar el nombre de sala')
  //   } else {
  //     io.emit('new-room', {
  //       name: data.roomName,
  //       users: 0,
  //     })

  //     handleReset()
  //   }
  // }

  // const handleReset = () => {
  //   let e = document.querySelector('input[name=roomName]')

  //   e.value = ''
  // }

  // const handleInputChange = (e) => {
  //   setData({
  //     ...data,
  //     [e.target.name]: e.target.value,
  //   })
  // }

  return (
    <></>
    // <div className="room">
    //   <form className="CRoomForm" onSubmit={handleCreateRoom}>
    //     <input
    //       type="text"
    //       name="roomName"
    //       placeholder="Nombre de sala"
    //       onChange={handleInputChange}
    //     />

    //     <button className="create-room" type="submit">
    //       Crear sala
    //     </button>
    //   </form>

    //   <ul className="list-rooms">
    //     {Object.keys(localRooms).map((singleRoom) => (
    //       <li className="room-section" key={singleRoom}>
    //         {singleRoom}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  )
}

export default CreateRoom
