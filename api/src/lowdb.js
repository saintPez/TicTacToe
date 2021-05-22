const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

let db

async function connection() {
  const adapter = new FileAsync('db.json')
  db = await low(adapter)
  db.defaults({ users: [], rooms: [], queue: [] }).write()
}

const lowdb = () => db

module.exports = {
  connection,
  lowdb,
}
