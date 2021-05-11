export const formatMessage = (text) => {
  const message = text.replace(/"/g, '')
  return message.charAt(0).toUpperCase() + message.slice(1)
}

const validate = (schema, value) => {
  const result = schema.validate({
    email: value,
  })
  if (result.error) {
    const message = formatMessage(result.error.details[0].message)

    return {
      status: true,
      message,
    }
  } else {
    return {
      status: false,
    }
  }
}

export default validate
