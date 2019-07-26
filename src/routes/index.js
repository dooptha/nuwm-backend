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
    const {name, deviceId} = req.body;
    console.log("Login Body:", req.body);
    if (!name || !deviceId)
      return res.status(400).send({error: "Not enough data"});
    return users.findByDeviceId(deviceId)
      .then(user => {
        console.log("User from db:", user);
        if(!user)
          return users.create(name, deviceId);
        return user;
      })
      .then((user) => AuthHandler.login(user))
      .then((token) => res.send({token}))
      .catch(err => res.status(500).send({error: err.message}));
  });

  return router;
};
