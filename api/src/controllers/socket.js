const { v4: uuidv4 } = require('uuid')
const createError = require('http-errors')

const { lowdb } = require('../lowdb')

const getRooms = (req, res, next) => {
  const user = lowdb()
    .get('users')
    .find({ id: `${req.user._id}` })
    .value()
  if (!user)
    return next(createError(401, 'User not signed on socket', { expose: true }))

  const rooms = lowdb().get('rooms').value()

  res.json({ success: true, rooms })
}

const createRoom = (req, res, next) => {
  const user = lowdb()
    .get('users')
    .find({ id: `${req.user._id}` })
    .value()
  if (!user)
    return next(createError(401, 'User not signed on socket', { expose: true }))

  const uuid = uuidv4()
  const room = lowdb()
    .get('rooms')
    .push({ id: uuid, config: req.body.config, users: [] })
    .write()

  res.json({ success: true, room })
}

module.exports = {
  getRooms,
  createRoom,
}
