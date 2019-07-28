const router = require("express").Router();
const users = require("../persistent/repository/users");
const AuthHandler = require("../services/AuthHandler");

module.exports = function () {

  router.get("/access", function (req, res) {
    const {role} = req.user;
    return AuthHandler.isAccessGranted(AuthHandler.ROLES.MODERATOR, role) ?
      res.status(200).end() :
      res.status(403).end();
  });

  // TODO: Create validation
  router.post("/", function (req, res) {
    const data = req.body;
    const {deviceId} = req.user;
    return users.update(deviceId, data)
      .then(user => res.send({user}))
      .catch(err => res.status(500).send({error: err.message}));
  });

  return router;
};
