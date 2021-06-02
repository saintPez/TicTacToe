const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  games: [
    {
      data: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
      },
      result: {
        type: Boolean,
        required: false,
      },
    },
  ],
  score: {
    type: Number,
    default: 10,
  },
  admin: {
    type: Boolean,
    default: false,
  },
})

userSchema.set('versionKey', false)
userSchema.set('timestamps', true)

const User = model('User', userSchema)

module.exports = User
