const { FCM } = require('./fcm.class')

module.exports = function (app) {
  app.use('/fcm', new FCM({}, app))

  // useful service from application (can register hooks, etc..)
  const service = app.service('fcm')
}
