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

//Models database

const User = require('./models/user')

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

  socket.on('player-exit', async () => {})

  socket.on('player-won', async (data) => {
    players.session.email = data.email
    players.session.score = data.score

    const player_score = await User.findOne({ email: players.email })

    if (!player_score) {
      User.updateOne({ email: players.email }, { score: players.score })
    }
  })

  //Game

  socket.on('new-room', async () => {})

  socket.on('update-list-room', async () => {})
})
