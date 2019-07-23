const router = require("express").Router();

module.exports = function () {

  router.get("/", function (req, res) {
    return res.redirect("https://dooptha.com");
  });

  router.get("/ping", function (req, res) {
    return res.send("pong");
  });

  router.post("/login", function (req, res) {
    const token = "token";
    return res.send({token})
  });

  return router;
};
