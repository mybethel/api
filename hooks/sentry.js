const {
  Handlers,
  init
} = require('@sentry/node')

module.exports = app => {
  init(app.config.sentry)

  app.use(Handlers.requestHandler())
  app.use(Handlers.errorHandler())
}
