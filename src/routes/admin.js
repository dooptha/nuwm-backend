const router = require('express').Router()
const MessagesHistory = require('../services/MessagesHistory')

const adminRoute = function (io) {

  router.post('/messages/delete', function (req, res) {
    const {message} = req.body
    return MessagesHistory.removeAll()
      .then(() => io.of('/flood').emit('messages:removed'))
      .then(() => res.status(200).end())
      .catch(err => res.status(500).send({error: err.message}))
  })

  router.get('/messages', function (req, res) {
    return MessagesHistory.getLastMessages()
      .then(messages => res.status(200).send({messages}))
      .catch(err => res.status(500).send({error: err.message}))
  })

  return router
}

module.exports = adminRoute
