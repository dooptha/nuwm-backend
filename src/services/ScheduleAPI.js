const request = require('request');
const queryString = require('querystring');
const iconv = require('iconv-lite');
const {CustomError} = require('../services/ErrorHandler');

const Timetable = require('./entities/Timetable');

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

  getGroupsList() {
    const options = {encoding: null, method: "GET"};
    return new Promise((resolve, reject) => {
      return request(
        "http://desk.nuwm.edu.ua/cgi-bin/timetable.cgi?n=701&lev=142",
        options,
        function (error, response, body) {
          if (error) return reject(new CustomError(error, 400));
          const responseBody = JSON.parse(iconv.decode(body, "windows-1251"));
          if (responseBody.code === 33 || response.error)
            return reject(new CustomError(responseBody.error, 404));
          if (responseBody.response === null)
            return reject(new CustomError("Empty response from NUWM API", 400));
          console.log(responseBody);
          return resolve(responseBody.suggestions);
        }
      );
    });
  }

}

module.exports = ScheduleAPI;