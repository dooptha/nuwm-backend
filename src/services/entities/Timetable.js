class Subject {
  constructor(data, lecturer, requestGroup) {
    this.lecturer = data.lecturer || lecturer;
    this.group = data.subgroup;
    this.lesson = data.lessonNum;
    this.time = data.time;
    this.classroom = data.classroom;
    this.name = data.subject;
    this.type = data.type;
    this.streamsType = data.streams_type;

    this.setCustomFields(requestGroup);
  }

  setCustomFields(requestGroup) {
    if (
      this.group &&
      this.streamsType !== 'Потік' &&
      !this.group.includes(requestGroup)
    )
      this.displayGroup = this.group;
  }
}

class Day {
  constructor(data, lecturer, requestGroup) {
    this.date = data.day;
    this.dayName = data.dayname;
    this.day = data.day_of_week;
    this.dayOfYear = data.day_of_year;
    this.subjects = data.subjects
      .map(subject => new Subject(subject, lecturer, requestGroup));
  }
}

class Timetable {
  constructor(body, params) {
    this.lecturer = params.name;
    this.requestGroup = params.group;
    this.schedule = body.response.schedule
      .map(day => new Day(day, this.lecturer, this.requestGroup));
  }
}

module.exports = Timetable;