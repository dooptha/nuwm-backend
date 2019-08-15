const router = require("express").Router();
const users = require("../persistent/repository/users");
const AuthHandler = require("../services/AuthHandler");

const usersRoute = function () {
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

  router.get("/", function (req, res) {
    const {deviceId} = req.user;
    return users.findByDeviceId(deviceId)
      .then(user => {
        user.deviceId = undefined;
        user["__v"] = undefined;
        return res.send({user});
      })
      .catch(err => res.status(500).send({error: err.message}));
  });

  return router;
};

module.exports = usersRoute;
