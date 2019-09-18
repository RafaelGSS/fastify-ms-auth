'use strict'
require('dotenv').config()

const { test } = require('tap')
const sget = require('simple-get').concat

const Fastify = require('fastify')

const knex = require('../../src/plugins/knex.except')
const configKnex = require('../../src/config/pg')

test('knex decorator works in encapsulation', t => {
  t.plan(6)
  const fastify = Fastify()
  fastify.register(knex, configKnex)

  fastify.register((instance, opts, next) => {
    instance.get('/test-knex', function (request, reply) {
      t.ok(this.knex, 'knex decorator exists')
      reply.send({ hello: 'world' })
    })

    next()
  })

  fastify.listen(0, err => {
    t.error(err)
    fastify.server.unref()

    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/test-knex'
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-length'], '' + body.length)
      t.deepEqual(JSON.parse(body), { hello: 'world' })
      t.end()
    })
  })
})

test('check 2 instance of knex', t => {
  t.plan(7)
  const fastify = Fastify()
  fastify.register(knex, { name: 'testknex1', ...configKnex })
  fastify.register(knex, { name: 'testknex2', ...configKnex })

  fastify.register((instance, opts, next) => {
    instance.get('/test-knex', function (request, reply) {
      t.ok(this.testknex1, 'knex1 decorator exists')
      t.ok(this.testknex2, 'knex2 decorator exists')
      reply.send({ hello: 'world' })
    })

    next()
  })

  fastify.listen(0, err => {
    t.error(err)
    fastify.server.unref()

    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/test-knex'
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-length'], '' + body.length)
      t.deepEqual(JSON.parse(body), { hello: 'world' })
      t.end()
    })
  })
})
