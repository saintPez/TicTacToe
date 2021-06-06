const { v4: uuidv4 } = require('uuid')
const createError = require('http-errors')

const { lowdb } = require('../lowdb')

const User = require('../models/user')

const isSigned = async (req, res, next) => {
  try {
    const user = await lowdb()
      .get('users')
      .find({ id: `${req.user._id}`, socket: `${req.query.socket}` })
      .value()

    if (!user)
      return next(
        createError(401, 'User not signed on socket', { expose: true })
      )

    req.socket = user

    next()
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

const getRooms = async (req, res, next) => {
  try {
    const rooms = await lowdb().get('rooms').value()

    res.json({ success: true, rooms })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

const createRoom = async (req, res, next) => {
  try {
    const userInRoom = await lowdb()
      .get('rooms')
      .find((room) => {
        if (room.users.find((user) => user.id == `${req.user._id}`)) return true
      })
      .value()

    if (userInRoom)
      return next(
        createError(400, 'User is already joined in a room', { expose: true })
      )

    const uuid = uuidv4()
    await lowdb()
      .get('rooms')
      .push({ id: uuid, config: req.body.config, users: [] })
      .write()

    res.json({
      success: true,
      room: { id: uuid, config: req.body.config, users: [] },
    })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

const queue = async (req, res, next) => {
  try {
    const userInRoom = await lowdb()
      .get('rooms')
      .find((room) => {
        if (room.users.find((user) => user.id == `${req.user._id}`)) return true
      })
      .value()

    if (userInRoom)
      return next(
        createError(400, 'User is already joined in a room', { expose: true })
      )

    const user = await User.findOne({ _id: req.socket.id })

    await lowdb()
      .get('queue')
      .push({
        id: req.socket.id,
        socket: req.socket.socket,
        name: req.socket.name,
        score: user.score,
      })
      .write()

    res.json({
      success: true,
    })
  } catch (error) {
    next(createError(500, 'Something has gone wrong', { expose: true }))
  }
}

module.exports = {
  isSigned,
  getRooms,
  createRoom,
  queue,
}
