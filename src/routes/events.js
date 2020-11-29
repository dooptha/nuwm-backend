const router = require('express').Router()
const events = require('../persistent/repository/events')

const eventsRoute = function () {

  router.get('/', function (req, res) {
    const page = req.query.page || 0
    return events.getList(page)
      .then(events => res.send({events}))
      .catch(err => res.status(500).send({error: err.message}))
  })

  return router
}

module.exports = eventsRoute
