const { config } = require('dotenv')
config({ path: `.env.${process.env.NODE_ENV}` })

const app = require('./app')

const { Server } = require('socket.io')

const { PORT } = require('./env')

const bcrypt = require('bcrypt')

const axios = require('axios')

// const generateIntervalObject = require('./utils/utils')

// Database

require('./database')

// Server

const server = app.listen(PORT, async () => {
  console.log(`Info: Server running on port ${PORT}`)
})

//Vars settings

const updateInterval = parseInt(process.env.UPDATE_INTERVAL)
const minRoomSize = parseInt(process.env.MIN_ROOM_SIZE)
//const maxRank = parseInt(process.env.MAX_RANK)
//const rankInterval = parseInt(process.env.RANK_INTERVAL)
//const rankChecks = generateIntervalObject(maxRank, rankInterval)
const gameServer = process.env.GAME_SERVER_URI

// Sockets

let users = []
let queue = []
let socketIds = {}
let rooms = {}

const io = new Server(server)

io.on('connection', (socket) => {
  console.log('New connection')

  socket.on('emit-room', (data) => {
    console.log(data)
  })

  socket.on('new-user', (userId) => {
    socket.user = userId
    users.push({ id: socket.id, user: userId })
  })

  socket.on('new-room', (room) => {
    if (room) {
      socket.join(room)
    } else {
      var code = 'createCode'
      var salt = bcrypt.genSalt(10)
      code = bcrypt.hash(code, salt)
      socket.join(code)
    }
  })

  socket.on('check-in', (user) => {
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
  })

  socket.on('disconnect', () => {
    removeUserFromUsers(socket.user)
    removeUserFromQueue(socket.user)
  })
})

setInterval(() => {
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
}

/* const joinUniqueClient = (id, roomName) => {
  io.sockets.to(id).join(roomName)
} */

const findRoomId = (userId) => {
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

const createNewRoom = async (users) => {
  return await axios.post(`${gameServer}/room`, {
    users: users,
  })
}
