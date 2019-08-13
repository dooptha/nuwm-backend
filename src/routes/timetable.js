const router = require("express").Router();

const ScheduleAPI = require('../services/ScheduleAPI');
const {memoryCacheMiddleware, clientCacheMiddleware} = require("../services/middlewares");
const config = require('../../config');

const scheduleAPI = new ScheduleAPI(config);

module.exports = function () {

  router.get("/",
    memoryCacheMiddleware(60 * 5),
    function (req, res) {
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

  router.get("/test", function (req, res) {
    return res.send(ScheduleAPI.getMockResponse());
  });

  router.get("/groups",
    clientCacheMiddleware(),
    memoryCacheMiddleware(60 * 60),
    function (req, res) {
      return scheduleAPI.getGroupsList()
        .then(groups => res.send({groups}))
        .catch(err => res.status(500).send({error: err.message}));
    });

  router.get("/lecturers",
    clientCacheMiddleware(),
    memoryCacheMiddleware(60 * 60),
    function (req, res) {
      return scheduleAPI.getLecturersList()
        .then(lecturers => res.send({lecturers}))
        .catch(err => res.status(500).send({error: err.message}));
    });

  return router;
};
