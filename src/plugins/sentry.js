const fp = require('fastify-plugin')
const Sentry = require('@sentry/node')

const configSentry = require('../config/sentry')(process.env.NODE_ENV === 'production')

module.exports = fp(function (fastify, opts, next) {
  Sentry.init(configSentry)
  fastify.setErrorHandler((err, req, reply) => {
    // Check if has error by validation
    if (err.validation) {
      reply.error({ statusCode: 400, message: err.message })
      return
    }
    Sentry.withScope(scope => {
      scope.setUser({
        ip_address: req.raw.ip
      })
      scope.setTag('path', req.raw.url)

      Sentry.captureException(err)
      opts.errorHandler
        ? opts.errorHandler(err, req, reply)
        : reply.error({ statusCode: 500, message: err.message })
    })
  })
  next()
})
