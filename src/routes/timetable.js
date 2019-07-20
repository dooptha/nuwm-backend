const router = require("express").Router();

const ScheduleAPI = require('../services/ScheduleAPI');
const config = require('../../config');

const scheduleAPI = new ScheduleAPI(config);

module.exports = function () {

  router.get("/", function (req, res) {
    const {lecturer, group, startDate, endDate} = req.query;
    const params = {
      name: lecturer,
      group: group,
      sdate: startDate,
      edate: endDate,
    };
    return scheduleAPI.getScheduleByParams(params)
      .then(body => res.send(body))
      .catch(err => res.status(err.code || 500).send({error: err.message}));
  });

  return router;
};
