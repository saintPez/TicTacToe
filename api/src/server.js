const { config } = require('dotenv')
config()

const app = require('./app')

const { PORT } = require('./env')

//const bcrypt = require('bcrypt')

// const generateIntervalObject = require('./utils/utils')

require('./database')
const { connection, lowdb } = require('./lowdb')

connection()
const server = app.listen(PORT, async () => {
  console.log(`Info: Server running on port ${PORT}`)
})

//Vars settings

// const updateInterval = parseInt(process.env.UPDATE_INTERVAL)
// const minRoomSize = parseInt(process.env.MIN_ROOM_SIZE)
//const maxRank = parseInt(process.env.MAX_RANK)
//const rankInterval = parseInt(process.env.RANK_INTERVAL)
//const rankChecks = generateIntervalObject(maxRank, rankInterval)
// const gameServer = process.env.GAME_SERVER_URI

// Sockets

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  socket.on('signIn', async ({ id, name }) => {
    try {
      const user = await lowdb()
        .get('users')
        .find({ id: `${id}` })
        .value()

      if (user) return socket.emit('signIn', { success: false })

      await lowdb().get('users').push({ id, name, socket: socket.id }).write()

      socket.user = { id, name }
      socket.emit('signIn', { success: true, id: socket.id })
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('chat-global', ({ message }) => {
    socket.broadcast.emit('chat-global', { message, user: socket.user?.name })
  })

  // socket.on('new-room', (room) => {
  //   const rooms = getRooms()
  //   if (!socket.user) return
  //   if (rooms[room.id]) {
  //     socket.join(room.id)
  //     rooms[room.id].users[socket.user.id] = {
  //       name: socket.user.name,
  //       socket: socket.id,
  //     }
  //     socket.room = room.id
  //   } else {
  //     const uuid = uuidv4()
  //     socket.join(uuid)
  //     rooms[uuid] = {}
  //     rooms[uuid].config = room.config
  //     rooms[uuid].users[socket.user.id] = {
  //       name: socket.user.name,
  //       socket: socket.id,
  //     }
  //     socket.room = uuid
  //   }

  //   io.in(socket.room).emit('room', {
  //     id: socket.room,
  //     config: rooms[socket.room].config,
  //     users: rooms[socket.room].users,
  //   })

  //   setRooms(rooms)

  //   socket.broadcast.emit('get-list-rooms', rooms)
  // })

  socket.on('join', async (roomId) => {
    try {
      const room = await lowdb()
        .get('rooms')
        .find({ id: `${roomId}` })
        .value()

      const userInRoom = await lowdb()
        .get('rooms')
        .find((room) => {
          if (room.users.find((user) => user.id == `${socket.user?.id}`))
            return true
        })
        .value()

      if (!socket.user || !room || userInRoom)
        return socket.emit('join', { success: false })

      socket.join(roomId)

      const users = await lowdb()
        .get('rooms')
        .find({ id: `${roomId}` })
        .get('users')
        .value()

      users.push({
        id: socket.user.id,
        name: socket.user.name,
        socket: socket.id,
      })

      await lowdb()
        .get('rooms')
        .find({ id: `${roomId}` })
        .assign({ users })
        .write()

      socket.emit('join', {
        success: true,
        room: {
          id: roomId,
          config: room.config,
          users: users,
        },
      })

      socket.to(roomId).emit('room', {
        id: roomId,
        config: room.config,
        users: users,
      })
    } catch (error) {
      console.log(error)
    }
  })

  /*socket.on('check-in', (user) => {
    socketIds[user] = socket.id
  })

  socket.on('request-greet', (userId) => {
    console.log('queue: ', queue)
    console.log(userId)
  })

  socket.on('check-users', () => {
    console.log('\n\nqueue: ', queue)
  })

  socket.on('accept-match', (userId) => {
    const roomId = findRoomId(userId)
    const userIndex = findUserIndexInRoom(userId, roomId)

    socket.join(roomId)
    const currentRoom = rooms[roomId]

    currentRoom[userIndex].hasAccepted = true

    // If all the clients accept the request, send them to the room
    if (
      !currentRoom.map((userInRoom) => userInRoom.hasAccepted).includes(false)
    ) {
      createNewRoom(currentRoom)
        .then((res) => {
          console.log(res)
          console.log('New room created')
          io.in(roomId).emit('match-accepted', currentRoom)
          delete rooms[roomId]

          io.socketsLeave(roomId)
        })
        .catch(() => {
          console.log('Error creating the game')
          const _ = undefined
          errorMatchActions(roomId, _, currentRoom, 'GameServerError')
        })
    }
  })*/

  socket.on('disconnect', async () => {
    try {
      // Users

      await lowdb().get('users').remove({ id: socket.user?.id }).write()

      // Rooms

      const room = await lowdb()
        .get('rooms')
        .find((room) => {
          if (room.users.find((user) => user.id == `${socket.user?.id}`))
            return true
        })
        .value()

      if (room) {
        if (room.users.length == 1) {
          await lowdb().get('rooms').remove({ id: room.id }).write()
        } else {
          const index = room.users.findIndex(
            (_user) => _user == `${socket.user?.id}`
          )
          room.users.splice(index, 1)
          await lowdb().get('rooms').assign({ users: room.users })
        }
      }

      // Queue

      await lowdb().get('queue').remove({ id: socket.user?.id }).write()
    } catch (error) {
      console.log(error)
    }
  })
})

/*setInterval(() => {
  // rankChecks.forEach(singleRange => {
  //   checkIfMatch(singleRange.min, singleRange.max)
  // })
  checkIfMatch(0, 1000)
}, updateInterval)

const checkIfMatch = (min, max) => {
  const matchedUsers = queue
    .filter((singleUser) => singleUser.rank >= min && singleUser.rank <= max)
    .slice(0, minRoomSize)

  if (matchedUsers.length >= minRoomSize) {
    const newRoomId = Math.random().toString(16).substr(2, 15)
    rooms[newRoomId] = []
    console.log('NEW ROOM ID', newRoomId)
    matchedUsers.forEach((singleUser) => {
      sendUniqueResponse(socketIds[singleUser.id], 'matched')
      const newUserToRoom = {
        ...singleUser,
        hasAccepted: false,
      }
      rooms[newRoomId].push(newUserToRoom)
      queue = queue.filter((queueUser) => queueUser.id !== singleUser.id)
    })
  }
}

const sendUniqueResponse = (id, emitId, message) => {
  io.sockets.to(id).emit(emitId, message)
}*/

/* const joinUniqueClient = (id, roomName) => {
  io.sockets.to(id).join(roomName)
} */

/*const findRoomId = (userId) => {
  const roomsValues = Object.values(rooms)
  const singleLevelValues = roomsValues.map((singleRoomValue) =>
    singleRoomValue.map((singleObjectInsideRoom) => singleObjectInsideRoom.id)
  )
  const roomIndex = singleLevelValues.findIndex((roomMembers) =>
    roomMembers.includes(userId)
  )
  const roomId = Object.keys(rooms)[roomIndex]
  return roomId
}

const findUserIndexInRoom = (userId, roomId) => {
  const userIndex = rooms[roomId].findIndex(
    (userInRoom) => userInRoom.id === userId
  )

  return userIndex
}

const errorMatchActions = (roomId, user, currentRoom, rejectionType) => {
  // We emit one player rejects to all who are in the provisional room (joined or not)
  const actionsHashMap = {
    MatchRejected: () => {
      Object.values(currentRoom).forEach((singleUser) => {
        if (singleUser.id !== user.id) {
          io.to(socketIds[singleUser.id]).emit('match-canceled', rejectionType)

          // Place back the users who didn't declined the match
          queue.push(singleUser)
        }
      })
    },

    GameServerError: () => {
      Object.values(currentRoom).forEach((singleAffectedUser) => {
        io.to(socketIds[singleAffectedUser.id]).emit(
          'match-canceled',
          rejectionType
        )
      })
    },
  }

  actionsHashMap[rejectionType]()
  // Then we can delete the provisional room and delete the user who declined the match from the queue
  delete rooms[roomId]
}

const createNewRoom = async () => {
  // return await axios.post(`${gameServer}/room`, {
  //   users: users,
  // })
}*/
