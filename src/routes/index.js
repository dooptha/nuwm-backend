const router = require("express").Router();
const users = require("../persistent/repository/users");
const AuthHandler = require("../services/AuthHandler");

module.exports = function () {

  router.get("/", function (req, res) {
    return res.redirect("https://dooptha.com");
  });

  router.get("/ping", function (req, res) {
    return res.send("pong");
  });

  router.post("/login", function (req, res) {
    const {username, deviceId} = req.body;
    console.log("Login Body:", req.body);
    if (!username || !deviceId)
      return res.status(400).send({error: "Not enough data"});
    return users.findByDeviceId(deviceId)
      .then(user => user === null ? users.create(username, deviceId) : user)
      .then((user) => AuthHandler.login(user)
        .then((token) => res.send({user, token}))
      )
      .catch(err => res.status(500).send({error: err.message}));
  });

  return router;
};
