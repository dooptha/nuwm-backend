const request = require('request');
const queryString = require('querystring');

class ScheduleAPI {
  constructor(config) {
    this.API_ENDPINT = config.SCHEDULE_API_ENDPOINT;
  }

  getScheduleByParams(params) {
    return new Promise((resolve, reject) => {
      return request(
        `${this.API_ENDPINT}?${queryString.stringify(params)}`,
        function (error, response, body) {

          if(error) {
            return reject(new Error(error));
          }

          return resolve(body);
        }
      );
    })
  }

}

module.exports = ScheduleAPI;