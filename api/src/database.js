const mongoose = require('mongoose')

const { MONGO_URI } = require('./env')

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

mongoose.connection.on('error', (err) => {
  console.error(err)
  mongoose.disconnect()
  process.exit(1)
})

mongoose.connection.once('open', () =>
  console.log(`Info: Database is connected to '${MONGO_URI}'`)
)
