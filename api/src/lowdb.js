const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

let db

async function connection() {
  const adapter = new FileAsync('db.json')
  db = await low(adapter)
  db.__wrapped__ = { users: [], rooms: [], queue: [] }
  await db.write()
}

const lowdb = () => db

module.exports = {
  connection,
  lowdb,
}
