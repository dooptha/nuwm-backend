const request = require('request');
const queryString = require('querystring');
const iconv = require('iconv-lite');
const {CustomError} = require('../services/ErrorHandler');

const Timetable = require('./entities/Timetable');

class ScheduleAPI {
  constructor(config) {
    this.API_ENDPINT = config.SCHEDULE_API_ENDPOINT;
    this.GET_REQUEST_OPTIONS = {
      encoding: null,
      method: "GET"
    }
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
    return new Promise((resolve, reject) => {
      return request(
        "http://desk.nuwm.edu.ua/cgi-bin/timetable.cgi?n=701&lev=142",
        this.GET_REQUEST_OPTIONS,
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

  getLecturersList() {
    const options = {encoding: null, method: "GET"};
    return new Promise((resolve, reject) => {
      return request(
        "http://desk.nuwm.edu.ua/cgi-bin/timetable.cgi?n=701&lev=141&faculty=0",
        this.GET_REQUEST_OPTIONS,
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

  static getMockResponse() {
    return {
      lecturer: "",
      schedule: [{
        date: '05.09.2018',
        dayName: 'Середа',
        day: 2,
        dayOfYear: 248,
        subjects: [{
          classroom: '441',
          group: 'ПМ-41, ІНФ-41',
          lecturer: 'Герус Володимир Андрійович',
          lesson: 2,
          name: 'Комп`ютерні мережі та їх адміністрування',
          time: '09:40-11:00',
          type: 'Лекція',
        },
          {
            classroom: '441',
            group: 'ПМ-41, ІНФ-41',
            lecturer: 'Герус Володимир Андрійович',
            lesson: 3,
            name: 'Комп`ютерні мережі та їх адміністрування',
            time: '11:00-12:20',
            type: 'Лекція',
          }],
      },
        {
          date: '06.09.2018',
          dayName: 'Середа',
          day: 2,
          dayOfYear: 248,
          subjects: [{
            classroom: '441',
            group: 'ПМ-41, ІНФ-41',
            lecturer: 'Герус Володимир Андрійович',
            lesson: 2,
            name: 'Комп`ютерні мережі та їх адміністрування',
            time: '09:40-11:00',
            type: 'Лекція',
          },
            {
              classroom: '441',
              group: 'ПМ-41, ІНФ-41',
              lecturer: 'Герус Володимир Андрійович',
              lesson: 3,
              name: 'Комп`ютерні мережі та їх адміністрування',
              time: '11:00-12:20',
              type: 'Лекція',
            }],
        }]
    };
  }

}

module.exports = ScheduleAPI;