const express = require('express')

const cors = require('cors')
const helmet = require('helmet')
const createError = require('http-errors')

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

// Errors

app.use((req, res, next) => {
  next(createError(404, 'Not found'))
})

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ success: false, status: err.status || 500, name: err.name, ...err })
  next()
})

module.exports = app
