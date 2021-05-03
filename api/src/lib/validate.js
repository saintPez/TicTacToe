const createError = require('http-errors')

const types = ['body', 'query', 'headers', 'params', 'cookies']

const validate = {}

for (const type of types) {
  validate[type] = (schema) => (req, res, next) => {
    const { error } = schema.validate(req[type], {
      abortEarly: false,
      allowUnknown: true,
    })
    if (error)
      return next(createError(400, { details: error.details, expose: true }))
    next()
  }
}

module.exports = { ...validate }
