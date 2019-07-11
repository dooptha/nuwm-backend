const router = require("express").Router();

module.exports = function () {

  router.get("/", function (req, res) {
    return res.redirect("https://dooptha.com");
  });

  return router;
};
