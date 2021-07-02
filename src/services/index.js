const fcm = require('./fcm/fcm.service')

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(fcm)
}
