const base = {
  response: {
    statusCode: 200,
    message: null,
    error: false
  },
  data: []
}

/**
 * Build response base by plugin
 */
module.exports = (data, response) => {
  const baseT = { ...base }

  baseT.response = { ...base.response, ...response }
  baseT.data = data

  return baseT
}
