const { config } = require('dotenv')
config({ path: `.env.${process.env.NODE_ENV}` })

const app = require('./app')

const { PORT } = require('./env')

// Database

require('./database')

// Server

app.listen(PORT, async () => {
  console.log(`Info: Server running on port ${PORT}`)
})
