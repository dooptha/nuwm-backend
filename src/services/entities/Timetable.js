class Subject {
  constructor(data, lecturer) {
    this.lecturer = data.lecturer || lecturer;
    this.group = data.subgroup;
    this.lesson = data.lessonNum;
    this.time = data.time;
    this.classroom = data.classroom;
    this.name = data.subject;
    this.type = data.type;
  }
}

class Day {
  constructor(data, lecturer) {
    this.date = data.day;
    this.dayName = data.dayname;
    this.day = data.day_of_week;
    this.dayOfYear = data.day_of_year;
    this.subjects = data.subjects
      .map(subject => new Subject(subject, lecturer));
  }
}

class Timetable {
  constructor(body, params) {
   this.lecturer = params.name;
   this.schedule = body.response.schedule
     .map(day => new Day(day, this.lecturer));
  }
}

module.exports = Timetable;