const router = require("express").Router();

const ScheduleAPI = require('../services/ScheduleAPI');
const config = require('../../config');

const scheduleAPI = new ScheduleAPI(config);

module.exports = function () {

  router.get("/", function (req, res) {
    const params = {
      name: req.query.lecturer,
      group: req.query.group,
      sdate: req.query.startDate,
      edate: req.query.endDate,
    };
    return scheduleAPI.getScheduleByParams(params)
      .then(body => res.send(body))
      .catch(err => res.status(500).send({error: err.message}));
  });

  return router;
};
