const environments = {
  PORT: process.env.PORT || '3000',
  MONGO_URI:
    process.env.MONGO_URI ||
    'mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]',
}

module.exports = environments
