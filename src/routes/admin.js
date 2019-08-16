const router = require("express").Router();
const users = require("../persistent/repository/users");
const AuthHandler = require("../services/AuthHandler");
const messages = require("../services/MessagesHistory");

const adminRoute = function () {

  router.post("/messages/delete", function (req, res) {
    const {message} = req.body;
    messages.delete(message);
    return res.status(200).end();
  });

  router.get("/messages", function (req, res) {
    return res.status(200).send({messages: messages.get()})
  });

  return router;
};

module.exports = adminRoute;
