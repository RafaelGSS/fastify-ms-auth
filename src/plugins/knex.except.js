'use strict'

const fp = require('fastify-plugin')
const knex = require('knex')

module.exports = fp(function (fastify, opts, done) {
  const name = opts.name || 'knex'
  delete opts.name

  if (fastify[name]) {
    done(new Error('Connection name already registered: ' + name))
    return
  }
  const conn = knex(opts)
  fastify.decorate(name, conn)
  fastify.addHook('onClose', () => conn.destroy())
  done()
})
