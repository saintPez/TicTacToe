const { config } = require('dotenv')
config({ path: `.env.${process.env.NODE_ENV}` })

const app = require('./app')

const { PORT } = require('./env')

// Database

require('./database')

// Server

const server = app.listen(PORT, async () => {
  console.log(`> Server running on port ${PORT}`)
})

//Sockets

const socketio = require('socket.io')
const io = socketio(server)

//Vars settings

var players = {}

io.on('connection', async (socket) => {
  //Players

  socket.on('new-player', async (data) => {
    if (players.session) {
      players.session.username = data.username
      players.session.email = data.email
      players.session.password = data.password
    } else {
      players.session = data.session
      players.session.username = data.username
      players.session.email = data.email
      players.session.password = data.password
    }
  })

  //Game

  socket.on('new-room', async (data) => {
    if (rooms.id == data.id) {
      //Set data in rooms.id = {} object

      var rooms = (id, name) => {
        rooms[id] = {}
        rooms[id].name = name
      }

      rooms(data.id, data.name)

      socket.emit('room-' + data.id)
    }
  })

  socket.on('update-list-room', async () => {})
})
