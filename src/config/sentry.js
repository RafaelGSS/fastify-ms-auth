module.exports = (prod) => {
  if (prod) {
    return {
      dns: process.env.SENTRY_DSN
    }
  }
  return {
    dns: 'https://00000000000000000000000000000000@sentry.io/0000000'
  }
}
