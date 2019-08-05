const router = require("express").Router();
const polls = require("../persistent/repository/polls");
const AuthHandler = require("../services/AuthHandler");

module.exports = function () {

  router.post("/:optionId", function (req, res) {
    const optionId = req.params.optionId;
    return polls.vote(optionId).then(poll => res.send({poll}))
      .catch(err => res.status(500).send({error: err.message}));
  });

  router.get("/active", function (req, res) {
    return polls.getActivePoll()
      .then(poll => res.send({poll}))
      .catch(err => res.status(500).send({error: err.message}));
  });

  router.get("/", function (req, res) {
    const page = req.query.page || 0;
    return polls.getClosed(page)
      .then(poll => res.send({poll}))
      .catch(err => res.status(500).send({error: err.message}));
  });

  router.use(AuthHandler.secureRoutes(AuthHandler.ROLES.MODERATOR));

  router.post("/", function (req, res) {
    const {question, options} = req.body;
    return polls.create(question, options)
      .then(poll => res.send({poll}))
      .catch(err => res.status(500).send({error: err.message}));
  });

  return router;
};
