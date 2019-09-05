const router = require("express").Router();
const MessagesHistory = require('../services/MessagesHistory');

const adminRoute = function () {

  router.post("/messages/delete", function (req, res) {
    const {message} = req.body;
    MessagesHistory.remove(message.id);
    return res.status(200).end();
  });

  router.get("/messages", function (req, res) {
    return MessagesHistory.getLastMessages()
      .then(messages => res.status(200).send({messages}))
      .catch(err => res.status(500).send({error: err.message}));
  });

  return router;
};

module.exports = adminRoute;
