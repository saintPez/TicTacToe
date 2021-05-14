export const formatMessage = (text) => {
  const message = text.replace(/"/g, '')
  return message.charAt(0).toUpperCase() + message.slice(1)
}

const validate = (schemaResults) => {
  if (schemaResults.error) {
    const message = formatMessage(schemaResults.error.details[0].message)

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
