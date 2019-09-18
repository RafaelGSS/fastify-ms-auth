'use strict'

const { factoryUserDomain } = require('../domain/userDomain')
const { factoryUserRepository } = require('../repositories/userRepository')

const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, done) {
  const userRepository = factoryUserRepository(fastify.knex)
  const userDomain = factoryUserDomain(userRepository)

  fastify.decorate('userDomain', userDomain)
  done()
})
