const request = require('request');
const queryString = require('querystring');
const {CustomError} = require('../services/ErrorHandler');

const Timetable = require('../entities/Timetable');

class ScheduleAPI {
  constructor(config) {
    this.API_ENDPINT = config.SCHEDULE_API_ENDPOINT;
  }

  getScheduleByParams(params) {
    return new Promise((resolve, reject) => {
      return request(
        `${this.API_ENDPINT}?${queryString.stringify(params)}`,
        function (error, response, body) {
          if (error) return reject(new CustomError(error, 400));
          const responseBody = JSON.parse(body);

          if (responseBody.code === 33 || response.error)
            return reject(new CustomError(responseBody.error, 404));
          if (responseBody.response === null)
            return reject(new CustomError("Empty response from NUWM API", 400));

          return resolve(ScheduleAPI.serialize(responseBody, params));
        }
      );
    })
  }

  static serialize(body, params) {
    return new Timetable(body, params);
  }

}

module.exports = ScheduleAPI;