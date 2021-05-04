const environments = {
  PORT: process.env.PORT || '3000',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/TicTacToe',
}

module.exports = environments
