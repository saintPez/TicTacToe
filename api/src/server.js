const { config } = require('dotenv')
config({ path: `.env.${process.env.NODE_ENV}` })

const app = require('./app')

const { Server } = require('socket.io')

const { PORT } = require('./env')

// Database

require('./database')

// Server

const server = app.listen(PORT, async () => {
  console.log(`> Server running on port ${PORT}`)
})

// Sockets

const users = []
const queue = []

const io = new Server(server)

io.on('connection', (socket) => {
  socket.on('new-user', (data) => {
    socket.user = data.user
    users.push({ id: socket.id, user: data.user })
  })

  socket.on('new-room', (room) => {
    if (room) {
      socket.join(room)
    } else {
      const code = 'createCode'
      socket.join(code)
    }
  })

  socket.on('disconnect', () => {
    removeUserFromUsers(socket.user)
    removeUserFromQueue(socket.user)
  })
})

const removeUserFromUsers = (socketId) => {
  users.splice(
    users.findIndex((user) => user.id === socketId),
    1
  )
}

const removeUserFromQueue = (socketId) => {
  queue.splice(
    queue.findIndex((user) => user.id === socketId),
    1
  )
}
