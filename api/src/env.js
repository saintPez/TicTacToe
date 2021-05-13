const environments = {
  PORT: process.env.PORT || '3000',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/TicTacToe',
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
}

module.exports = environments
