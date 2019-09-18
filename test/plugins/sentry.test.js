'use strict'

const { test } = require('tap')

const Fastify = require('fastify')
const sentry = require('../../src/plugins/sentry')

const errorHandler = (err, req, reply) => {
  reply.status(req.body.error).send({
    message: req.body.message,
    e: err.message
  })
}

test('fastify sentry error handler exist', t => {
  t.plan(4)
  const fastify = Fastify()

  fastify.register(sentry, {
    dsn: 'https://00000000000000000000000000000000@sentry.io/0000000',
    environment: 'test',
    errorHandler: errorHandler
  })

  fastify.post('/', async (_request, _reply) => {
    throw new Error('Oops')
  })

  fastify.ready(err => {
    t.error(err)
    fastify.inject(
      {
        method: 'POST',
        url: '/',
        payload: { error: 503, message: 'Internal Server Error' }
      },
      (_err, { statusCode, payload }) => {
        payload = JSON.parse(payload)
        t.strictEqual(statusCode, 503)
        t.strictEqual(payload.message, 'Internal Server Error')
        t.strictEqual(payload.e, 'Oops')
        fastify.close(() => {
          t.end()
          process.exit(0)
        })
      }
    )
  })
})
