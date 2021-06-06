const { config } = require('dotenv')
config()

const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const app = require('./app')

const {
  PORT,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
} = require('./env')

//const bcrypt = require('bcrypt')

// const generateIntervalObject = require('./utils/utils')

require('./database')
const { connection, lowdb } = require('./lowdb')

const Game = require('./models/game')
const User = require('./models/user')

connection()
const server = app.listen(PORT, async () => {
  console.log(`Info: Server running on port ${PORT}`)
})

// Sockets

const marks = ['X', 'O', 'Y', 'Z']

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

      if (
        !socket.user ||
        !room ||
        userInRoom ||
        room.config.players === room.users.length
      )
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

  socket.on('leave', async () => {
    for (let i = 0; i < socket.rooms.length; i++) {
      if (`${socket.rooms[i]}` !== `${socket.id}`) socket.leave(socket.rooms[i])
    }
    await leaveRoom(socket)

    socket.emit('leave', { success: true })
  })

  socket.on('ready', async () => {
    const room = await lowdb()
      .get('rooms')
      .find((room) => {
        if (room.users.find((user) => user.id == `${socket.user?.id}`))
          return true
      })
      .value()
    if (!room) return socket.emit('ready', { success: false })

    let users = room.users

    const index = users.findIndex((user) => user.id == `${socket.user?.id}`)

    users[index].ready = !users[index].ready

    if (
      users.filter((user) => user.ready === true).length === room.config.players
    ) {
      await lowdb()
        .get('rooms')
        .find({ id: `${room.id}` })
        .assign({ playing: true, users })
        .write()

      socket.emit('ready', {
        success: true,
        room: {
          id: room.id,
          config: room.config,
          users,
          playing: true,
        },
      })

      return socket.to(room.id).emit('room', {
        id: room.id,
        config: room.config,
        users,
        playing: true,
      })
    }

    await lowdb()
      .get('rooms')
      .find({ id: `${room.id}` })
      .assign({ users })
      .write()

    socket.emit('ready', {
      success: true,
      room: {
        id: room.id,
        config: room.config,
        users,
      },
    })

    socket.to(room.id).emit('room', {
      id: room.id,
      config: room.config,
      users,
    })
  })

  socket.on('game-ready', async () => {
    const room = await lowdb()
      .get('rooms')
      .find((room) => {
        if (
          room.users.find((user) => user.id == `${socket.user?.id}`) &&
          room.playing
        )
          return true
      })
      .value()

    if (!room) return socket.emit('game-ready', { success: false })

    let users = room.users

    const history = room.history || []

    const index = users.findIndex((user) => user.id == `${socket.user?.id}`)

    if (users[index].playing)
      return socket.emit('game-ready', { success: false })

    users[index].playing = true

    await lowdb()
      .get('rooms')
      .find({ id: `${room.id}` })
      .assign({ users, history, turn: 0 })
      .write()

    socket.emit('game-ready', {
      success: true,
      game: { id: room.id, history, users, playing: true, config: room.config },
    })

    socket.to(room.id).emit('game', {
      id: room.id,
      history,
      users,
      playing: true,
      config: room.config,
    })
  })

  socket.on('game-set', async ({ width, height }) => {
    const room = await lowdb()
      .get('rooms')
      .find((room) => {
        if (
          room.users.find((user) => user.id == `${socket.user?.id}`) &&
          room.playing
        )
          return true
      })
      .value()

    if (!room || room.win) return socket.emit('game-set', { success: false })

    if (
      room.users.filter((user) => user.playing === true).length !==
      room.config.players
    )
      return socket.emit('game-set', { success: false })

    let history = room.history
    let turn = room.turn

    if (`${socket.user.id}` !== `${room.users[turn].id}`)
      return socket.emit('game-set', { success: false })

    if (history.find((e) => e.width === width && e.height === height))
      return socket.emit('game-set', { success: false })

    history.push({ width, height, mark: marks[turn] })

    const win = checkWin(
      width,
      height,
      room.config.consecutive,
      history,
      room.config.width,
      room.config.height,
      marks[turn]
    )

    if (win) {
      await lowdb()
        .get('rooms')
        .find({ id: `${room.id}` })
        .assign({ finished: true })
        .write()

      const newGame = await createGame({ ...room, history }, socket.user?.id)

      const users = room.users.filter(
        (user) => `${user.id}` !== `${socket.user?.id}`
      )

      if (room.config.inverted) {
        for (const user of users) {
          const account = await wonUser(`${user.id}`, `${newGame._id}`)

          socket.to(`${user.socket}`).emit('game', {
            id: room.id,
            history,
            users: room.users,
            playing: true,
            config: room.config,
            win: { id: socket.user?.id, name: socket.user?.name },
            gameId: newGame.id,
            account,
          })
        }

        const account = await lostUser(`${socket.user?.id}`, `${newGame._id}`)

        socket.emit('game', {
          id: room.id,
          history,
          users: room.users,
          playing: true,
          config: room.config,
          win: { id: socket.user?.id, name: socket.user?.name },
          gameId: newGame.id,
          account,
        })
      } else {
        for (const user of users) {
          const account = await lostUser(`${user.id}`, `${newGame._id}`)

          socket.to(`${user.socket}`).emit('game', {
            id: room.id,
            history,
            users: room.users,
            playing: true,
            config: room.config,
            win: { id: socket.user?.id, name: socket.user?.name },
            gameId: newGame.id,
            account,
          })
        }

        const account = await wonUser(`${socket.user?.id}`, `${newGame._id}`)

        socket.emit('game', {
          id: room.id,
          history,
          users: room.users,
          playing: true,
          config: room.config,
          win: { id: socket.user?.id, name: socket.user?.name },
          gameId: newGame.id,
          account,
        })
      }
    } else if (room.config.width * room.config.height === history.length) {
      await lowdb()
        .get('rooms')
        .find({ id: `${room.id}` })
        .assign({ finished: true })
        .write()

      const newGame = await createGame({ ...room, history })

      const users = room.users.filter(
        (user) => `${user.id}` !== `${socket.user?.id}`
      )

      for (const user of users) {
        const account = await tiedUser(`${user.id}`, `${newGame._id}`)

        socket.to(`${user.socket}`).emit('game', {
          id: room.id,
          history,
          users: room.users,
          playing: true,
          config: room.config,
          tied: true,
          gameId: newGame.id,
          account,
        })
      }

      const account = await tiedUser(`${socket.user?.id}`, `${newGame._id}`)

      socket.emit('game', {
        id: room.id,
        history,
        users: room.users,
        playing: true,
        config: room.config,
        tied: true,
        gameId: newGame.id,
        account,
      })
    } else {
      turn++
      if (turn >= room.users.length) turn = 0

      await lowdb()
        .get('rooms')
        .find({ id: `${room.id}` })
        .assign({ history, turn })
        .write()

      socket.emit('game-set', {
        success: true,
        game: {
          id: room.id,
          history,
          users: room.users,
          playing: true,
          config: room.config,
        },
      })

      socket.to(room.id).emit('game', {
        id: room.id,
        history,
        users: room.users,
        playing: true,
        config: room.config,
      })
    }
  })

  socket.on('queue', async () => {
    let queue = await lowdb().get('queue').value()
    const result = queue.sort((a, b) => {
      if (a.score < b.score) return -1
      if (a.score > b.score) return 1
      return 0
    })

    for (let i = 0; i < result.length; i = i + 2) {
      if (result[i + 1]) {
        const uuid = uuidv4()
        await lowdb()
          .get('rooms')
          .push({
            id: uuid,
            config: {
              width: 10,
              height: 10,
              consecutive: 5,
              players: 2,
              inverted: false,
              password: null,
            },
            users: [],
          })
          .write()

        if (
          `${socket.id}` === `${result[i]?.socket}` ||
          `${socket.id}` === `${result[i + 1]?.socket}`
        ) {
          socket.emit('queue', { id: uuid })
        }

        socket.to(`${result[i]?.socket}`).emit('queue', {
          id: uuid,
        })

        socket.to(`${result[i + 1]?.socket}`).emit('queue', {
          id: uuid,
        })

        queue.splice(
          queue.findIndex((user) => `${user.id}` === `${result[i]?.id}`),
          1
        )

        queue.splice(
          queue.findIndex((user) => `${user.id}` === `${result[i + 1]?.id}`),
          1
        )
      }
    }

    await lowdb().get('queue').assign(queue).write()
  })

  socket.on('leave-queue', async () => {
    await lowdb().get('queue').remove({ id: socket.user?.id }).write()

    socket.emit('leave-queue', { success: true })
  })

  socket.on('disconnect', async () => {
    try {
      // Users

      await lowdb().get('users').remove({ id: socket.user?.id }).write()

      // Rooms

      await leaveRoom(socket)

      // Queue

      await lowdb().get('queue').remove({ id: socket.user?.id }).write()
    } catch (error) {
      console.log(error)
    }
  })
})

const leaveRoom = async (socket) => {
  const room = await lowdb()
    .get('rooms')
    .find((room) => {
      if (room.users.find((user) => user.id == `${socket.user?.id}`))
        return true
    })
    .value()

  if (room) {
    if (room.finished) {
      await lowdb().get('rooms').remove({ id: room.id }).write()
    } else if (room.playing) {
      await lowdb().get('rooms').remove({ id: room.id }).write()

      const users = room.users.filter(
        (user) => `${user.id}` !== `${socket.user?.id}`
      )

      if (room.config.inverted) {
        const newGame = await createGame(room, socket.user?.id)

        for (const user of users) {
          const account = await wonUser(`${user.id}`, `${newGame._id}`)

          socket.to(`${user.socket}`).emit('game', {
            id: room.id,
            history: room.history,
            users: room.users,
            playing: true,
            config: room.config,
            win: { id: socket.user?.id, name: socket.user?.name },
            gameId: newGame.id,
            account,
          })
        }

        const account = await lostUser(`${socket.user?.id}`, `${newGame._id}`)

        socket.emit('game', {
          id: room.id,
          history: room.history,
          users: room.users,
          playing: true,
          config: room.config,
          win: { id: socket.user?.id, name: socket.user?.name },
          gameId: newGame.id,
          account,
        })
      } else {
        const newGame = await createGame(room)

        for (const user of users) {
          const account = await wonUser(`${user.id}`, `${newGame._id}`)

          socket.to(`${user.socket}`).emit('game', {
            id: room.id,
            history: room.history,
            users: room.users,
            playing: true,
            config: room.config,
            win: { id: user.id, name: user.name },
            gameId: newGame.id,
            account,
          })
        }

        const account = await lostUser(`${socket.user?.id}`, `${newGame._id}`)

        socket.emit('game', {
          id: room.id,
          history: room.history,
          users: room.users,
          playing: true,
          config: room.config,
          gameId: newGame.id,
          account,
        })
      }
    } else if (room.users.length == 1) {
      await lowdb().get('rooms').remove({ id: room.id }).write()
    } else {
      const index = room.users.findIndex(
        (_user) => `${_user.id}` == `${socket.user?.id}`
      )
      room.users.splice(index, 1)

      for (const user of room.users) {
        socket.to(`${user.socket}`).emit('room', {
          id: room.id,
          users: room.users,
          config: room.config,
        })
      }

      await lowdb()
        .get('rooms')
        .find({ id: `${room.id}` })
        .assign({ users: room.users })
        .write()
    }
  }
}

const checkWin = (x, y, consecutive, history, width, height, mark) => {
  let consecutive_mark = 0

  for (let i = 1; i < consecutive; i++) {
    if (
      history.find(
        (e) => e.height === y && e.width === x + i && `${e.mark}` === `${mark}`
      )
    ) {
      consecutive_mark++
    } else break
  }

  if (consecutive_mark >= consecutive - 1) return true

  for (let i = 1; i < consecutive; i++) {
    if (
      history.find(
        (e) => e.height === y && e.width === x - i && `${e.mark}` === `${mark}`
      )
    ) {
      consecutive_mark++
    } else break
  }

  if (consecutive_mark >= consecutive - 1) return true

  consecutive_mark = 0

  for (let i = 1; i < consecutive; i++) {
    if (
      history.find(
        (e) => e.height === y - i && e.width === x && `${e.mark}` === `${mark}`
      )
    ) {
      consecutive_mark++
    } else break
  }

  if (consecutive_mark >= consecutive - 1) return true

  for (let i = 1; i < consecutive; i++) {
    if (
      history.find(
        (e) => e.height === y + i && e.width === x && `${e.mark}` === `${mark}`
      )
    ) {
      consecutive_mark++
    } else break
  }

  if (consecutive_mark >= consecutive - 1) return true

  consecutive_mark = 0

  for (let i = 1; i < consecutive; i++) {
    if (
      history.find(
        (e) =>
          e.height === y + i && e.width === x + i && `${e.mark}` === `${mark}`
      )
    ) {
      consecutive_mark++
    } else break
  }

  if (consecutive_mark >= consecutive - 1) return true

  for (let i = 1; i < consecutive; i++) {
    if (
      history.find(
        (e) =>
          e.height === y - i && e.width === x - i && `${e.mark}` === `${mark}`
      )
    ) {
      consecutive_mark++
    } else break
  }

  if (consecutive_mark >= consecutive - 1) return true

  consecutive_mark = 0

  for (let i = 1; i < consecutive; i++) {
    if (
      history.find(
        (e) =>
          e.height === y + i && e.width === x - i && `${e.mark}` === `${mark}`
      )
    ) {
      consecutive_mark++
    } else break
  }

  if (consecutive_mark >= consecutive - 1) return true

  for (let i = 1; i < consecutive; i++) {
    if (
      history.find(
        (e) =>
          e.height === y - i && e.width === x + i && `${e.mark}` === `${mark}`
      )
    ) {
      consecutive_mark++
    } else break
  }

  if (consecutive_mark >= consecutive - 1) return true

  return false
}

const createGame = async (room, result = false) => {
  const newGame = await Game.create({
    players: room.users.map((user) => user.id),
    history: room.history,
    board: {
      width: room.config.width,
      height: room.config.height,
      consecutive: room.config.consecutive,
      inverted: room.config.inverted,
    },
    result: result ? result : undefined,
  })

  return newGame
}

const wonUser = async (userId, gameId) => {
  const { score } = await User.findOne({ _id: userId })
  await User.updateOne(
    { _id: userId },
    {
      $set: { score: score + 3 },
      $push: { games: { data: `${gameId}`, result: true } },
    }
  )

  return await createToken(userId)
}

const lostUser = async (userId, gameId) => {
  const { score } = await User.findOne({ _id: userId })
  await User.updateOne(
    { _id: userId },
    {
      $set: { score: score - 3 <= 10 ? 10 : score - 3 },
      $push: { games: { data: `${gameId}`, result: false } },
    }
  )

  return await createToken(userId)
}

const tiedUser = async (userId, gameId) => {
  await User.updateOne(
    { _id: userId },
    {
      $push: { games: { data: `${gameId}` } },
    }
  )

  return await createToken(userId)
}

const createToken = async (userId) => {
  const user = await User.findOne({ _id: `${userId}` })

  const access_token = await jwt.sign(
    { _id: user._id, updatedAt: user.updatedAt.getTime() },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  )
  const refresh_token = await jwt.sign(
    { _id: user._id },
    REFRESH_TOKEN_SECRET + user.updatedAt.getTime(),
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  )

  return {
    access_token,
    token_type: 'Bearer',
    expires_in: ACCESS_TOKEN_EXPIRES_IN,
    refresh_token,
    refresh_token_expires_in: REFRESH_TOKEN_EXPIRES_IN,
  }
}
