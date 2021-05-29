const path = require('path')
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

// Statics

app.use(express.static(path.join(__dirname, '..', '..', 'app', 'build')))

// Routes

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/socket', socketRoutes)

app.use('/api/*', (req, res, next) => {
  next(createError(404, 'Not found', { expose: true }))
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'app', 'build', 'index.html'))
})

// Errors

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
