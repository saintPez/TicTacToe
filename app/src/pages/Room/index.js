import io from 'socket.io-client'

const socket = io('http://localhost:3000')

function Room() {
  socket.emit('emit-room', 'Hola mundo')
  console.log('Buenas')

  return <div>Buenos dias</div>
}

export default Room
