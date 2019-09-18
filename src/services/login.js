'use strict'

const schema = {
  description: 'Make authentication of user, and returns the token that expires in 6 hours',
  tags: ['Auth'],
  summary: 'Make authentication',
  body: {
    type: 'object',
    properties: {
      username: {
        description: 'Username to make login',
        type: 'string'
      },
      password: {
        type: 'string',
        description: 'Password of username'
      }
    },
    required: ['username', 'password']
  },
  security: []
}

module.exports = async (fastify, opts) => {
  fastify.post('/auth/login', { schema }, async function (request, reply) {
    const { username, password } = request.body

    try {
      const [data, response] = await this.userDomain.makeLogin(username, password)
      return reply.success(data, response)
    } catch (error) {
      return reply.error({ message: error.message })
    }
  })
}
