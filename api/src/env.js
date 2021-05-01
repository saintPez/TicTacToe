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
}

module.exports = environments
