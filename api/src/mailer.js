const nodemailer = require('nodemailer')

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
} = require('./env')

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

transporter
  .verify()
  .then(() => {
    console.log('Info: Transporter email is ready')
  })
  .catch((err) => {
    console.error(err)
    transporter.close()
    process.exit(1)
  })

module.exports = transporter
