const express = require('express')

const cors = require('cors')
const helmet = require('helmet')
const createError = require('http-errors')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const gameRoutes = require('./routes/game')
const socketRoutes = require('./routes/socket')

// App

const app = express()

// Middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(helmet())

// Routes

app.get('/', (req, res) => {
  res.json({})
})

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/socket', socketRoutes)

// Errors

app.use((req, res, next) => {
  next(createError(404, 'Not found', { expose: true }))
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    name: err.name,
    ...err,
    expose: err.expose || false,
  })
  next()
})

module.exports = app
