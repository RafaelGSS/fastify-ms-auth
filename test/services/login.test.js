'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('check route exists', (t) => {
  t.plan(2)
  const app = build(t)

  app.inject({
    url: '/auth/login',
    method: 'POST'
  }, (err, res) => {
    t.error(err)
    t.notEqual(res.statusCode, 404)
  })
})

test('should be return 400 code - invalid parameters', t => {
  t.plan(4)
  const app = build(t)

  app.inject({
    url: '/auth/login',
    method: 'POST',
    payload: {
      anyData: '1'
    }
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
    t.strictEqual(res.statusCode, 400)
    t.strictEqual(JSON.parse(res.payload).response.error, true)
  })
})

// 200 Code because, not error handled and is not a invalid page permission to return 403
test('should be return 200 code - invalid user/password', t => {
  t.plan(5)
  const app = build(t)

  app.inject({
    url: '/auth/login',
    method: 'POST',
    payload: {
      username: 'ASDADHSKADHSA',
      password: '2222'
    }
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
    t.strictEqual(res.statusCode, 200)
    t.deepEqual(JSON.parse(res.payload).response, {
      statusCode: 403,
      message: 'Usuário ou senha inválidos!',
      error: false
    })
    t.notOk(JSON.parse(res.payload).data.token)
  })
})

test('should be return 200 code - set correct login', t => {
  t.plan(5)
  const app = build(t)

  app.inject({
    url: '/auth/login',
    method: 'POST',
    payload: {
      username: 'devteam',
      password: 'devteam123'
    }
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.headers['content-type'], 'application/json; charset=utf-8')
    t.strictEqual(res.statusCode, 200)
    t.strictEqual(JSON.parse(res.payload).response.error, false)
    t.ok(JSON.parse(res.payload).data.token)
  })
})
