const environments = {
  PORT: process.env.PORT || '3000',
  MONGO_URI:
    process.env.MONGO_URI ||
    'mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET',
  ACCESS_TOKEN_EXPIRES_IN:
    parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN) || 86400,
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET',
  REFRESH_TOKEN_EXPIRES_IN:
    parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) || 259200,
  CODE_EXPIRES_IN: parseInt(process.env.CODE_EXPIRES_IN) || 600,
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT) || 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE == 'true' || false,
  EMAIL_USER: process.env.EMAIL_USER || 'example@mail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'password',
  UPDATE_INTERVAL: process.env.UPDATE_INTERVAL || 3000,
  MIN_ROOM_SIZE: process.env.MIN_ROOM_SIZE || 2,
  MAX_RANK: process.env.MAX_RANK || 200,
  RANK_INTERVAL: process.env.RANK_INTERVAL || 20,
  GAME_SERVER_URI: process.env.GAME_SERVER_URI || 'http://localhost:3000',
  SOCKETS_URI: process.env.SOCKETS_URI || 'http://localhost:3001',
}

module.exports = environments
