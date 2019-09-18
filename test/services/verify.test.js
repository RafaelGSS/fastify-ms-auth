'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('check route exists', (t) => {
  t.plan(2)
  const app = build(t)

  app.inject({
    url: '/auth/verify',
    method: 'GET'
  }, (err, res) => {
    t.error(err)
    t.notEqual(res.statusCode, 404)
  })
})

test('should be return 400 code - invalid parameters', t => {
  t.plan(4)
  const app = build(t)

  app.inject({
    url: '/auth/verify',
    method: 'GET',
    query: {
      anyData: '1'
    }
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
    t.strictEqual(res.statusCode, 400)
    t.strictEqual(JSON.parse(res.payload).response.error, true)
  })
})

test('should be return 200 code - invalid token', t => {
  t.plan(5)
  const app = build(t)

  app.inject({
    url: '/auth/verify',
    method: 'GET',
    query: {
      token: 'ASDADHSKADHSA'
    }
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
    t.strictEqual(res.statusCode, 403)
    t.deepEqual(JSON.parse(res.payload).response, {
      statusCode: 403,
      message: 'Token inválido!',
      error: true
    })
    t.notOk(JSON.parse(res.payload).data.token)
  })
})
