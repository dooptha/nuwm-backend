const router = require("express").Router();
const polls = require("../persistent/repository/polls");
const AuthHandler = require("../services/AuthHandler");

const pollsRoute = function (io) {
  router.post("/:optionId", function (req, res) {
    const optionId = req.params.optionId;
    const {deviceId} = req.user;
    return polls.vote(optionId, deviceId).then(poll => {
      if (!poll)
        return res.status(400).send({error: "Something goes wrong:("});
      io.of("/flood").emit('poll:updated', poll);
      return res.send({poll});
    })
      .catch(err => res.status(500).send({error: err.message}));
  });

  router.get("/active", function (req, res) {
    const {deviceId} = req.user;
    return polls.getActivePoll(deviceId)
      .then(result => res.send({poll: result.length ? result[0] : null}))
      .catch(err => res.status(500).send({error: err.message}));
  });

  router.get("/", function (req, res) {
    const page = req.query.page || 0;
    return polls.getClosedPolls(page)
      .then(polls => res.send({polls}))
      .catch(err => res.status(500).send({error: err.message}));
  });

  router.use(AuthHandler.secureRoutes(AuthHandler.ROLES.MODERATOR));

  router.post("/", function (req, res) {
    const {question, options} = req.body;
    return polls.create(question, options)
      .then(poll => {
        io.of("/flood").emit('poll:created', poll);
        return res.send({poll});
      })
      .catch(err => res.status(500).send({error: err.message}));
  });

  router.post("/active/close", function (req, res) {
    return polls.closeLastPoll()
      .then(_ => res.status(200).end())
      .catch(err => res.status(500).send({error: err.message}));
  });

  return router;
};

module.exports = pollsRoute;
