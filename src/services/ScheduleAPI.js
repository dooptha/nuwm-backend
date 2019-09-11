const request = require('request');
const queryString = require('querystring');
const iconv = require('iconv-lite');
const {CustomError} = require('../services/ErrorHandler');

const Timetable = require('./entities/Timetable');

const mockData = {
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
      dayName: 'Четверг',
      day: 3,
      dayOfYear: 249,
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

class ScheduleAPI {
  constructor(config) {
    this.API_ENDPINT = config.SCHEDULE_API_ENDPOINT;
    this.GET_REQUEST_OPTIONS = {
      encoding: null,
      method: "GET",
      timeout: 10000
    }
  }

  getScheduleByParams(params) {
    return new Promise((resolve, reject) => {
      return request(
        `${this.API_ENDPINT}?${queryString.stringify(params)}`,
        {timeout: 10000},
        function (error, response, body) {
          if (error.code === 'ETIMEDOUT') return reject(new CustomError("NUWM API sleeps", 400));
          if (error) return reject(new CustomError(error, 400));
          // Another promise to cover JSON.parse async error throw
          return Promise.resolve(body)
            .then(JSON.parse)
            .then((responseBody) => {
              if (responseBody.code === 33 || response.error)
                return reject(new CustomError(responseBody.error, 404));
              if (responseBody.response === null)
                return reject(new CustomError("Empty response from NUWM API", 400));

              return resolve(ScheduleAPI.serialize(responseBody, params));
            })
            .catch(err => reject(new CustomError("NUWM API is dead:(", 400)));
        }
      );
    })
  }

  static serialize(body, params) {
    return new Timetable(body, params);
  }

  getGroupsList() {
    return new Promise((resolve, reject) => {
      const GROUPS_LINK = "http://desk.nuwm.edu.ua/cgi-bin/timetable.cgi?n=701&lev=142";
      return request(GROUPS_LINK, this.GET_REQUEST_OPTIONS,
        function (error, response, body) {
          if (error.code === 'ETIMEDOUT') return reject(new CustomError("NUWM API sleeps", 400));
          if (error) return reject(new CustomError(error, 400));
          const responseBody = JSON.parse(iconv.decode(body, "windows-1251"));
          if (responseBody.code === 33 || response.error)
            return reject(new CustomError(responseBody.error, 404));
          if (responseBody.response === null)
            return reject(new CustomError("Empty response from NUWM API", 400));
          return resolve(responseBody.suggestions);
        }
      );
    });
  }

  getLecturersList() {
    return new Promise((resolve, reject) => {
      const LECTURERS_LINK = "http://desk.nuwm.edu.ua/cgi-bin/timetable.cgi?n=701&lev=141&faculty=0";
      return request(LECTURERS_LINK, this.GET_REQUEST_OPTIONS,
        function (error, response, body) {
          if (error.code === 'ETIMEDOUT') return reject(new CustomError("NUWM API sleeps", 400));
          if (error) return reject(new CustomError(error, 400));
          const responseBody = JSON.parse(iconv.decode(body, "windows-1251"));
          if (responseBody.code === 33 || response.error)
            return reject(new CustomError(responseBody.error, 404));
          if (responseBody.response === null)
            return reject(new CustomError("Empty response from NUWM API", 400));
          return resolve(responseBody.suggestions);
        }
      );
    });
  }

  static getMockResponse() {
    return mockData;
  }

}

module.exports = ScheduleAPI;