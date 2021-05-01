const { Schema, model } = require('mongoose')

const { CODE_EXPIRES_IN } = require('../env')

const codeSchema = new Schema({
  data: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  user_updatedAt: {
    type: Date,
    require: true,
  },
  createdAt: { type: Date, expires: `${CODE_EXPIRES_IN}s`, default: Date.now },
})

codeSchema.set('versionKey', false)
codeSchema.set('timestamps', true)

const CodeSchema = model('Code', codeSchema)

module.exports = CodeSchema
