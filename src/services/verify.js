// let token = req.headers['x-access-token'] || req.headers['authorization']
// if (!token) {
//   return res.json(res.status(403).setErrorMessage(403, 'Authentication Invalid').data)
// }

// jwt.verify(token, process.env.SECRET, (err, decoded) => {
//   if (err) {
//     return res.json(res.status(403).setErrorMessage(403, 'Authentication Invalid').data)
//   }
//   req.auth = decoded
//   next()
// })
'use strict'

const schema = {
  description: 'Check if token is valid',
  tags: ['Auth'],
  summary: 'Check if token is valid',
  querystring: {
    type: 'object',
    properties: {
      token: {
        description: 'Access token to check validation',
        type: 'string'
      }
    },
    required: ['token']
  }
}

module.exports = function (fastify, opts, next) {
  fastify.get('/auth/verify', { schema }, function ({ query }, reply) {
    const { token } = query

    this.userDomain.isAuthenticated(token)
      .then(user => reply.success(user, { message: 'Token válido!' }))
      .catch(_err => reply.error({ statusCode: 403, message: 'Token inválido!' }))
  })

  next()
}
