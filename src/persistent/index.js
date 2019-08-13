const mongoose = require('mongoose');
const config = require('../../config');

class MongoDB {
  constructor() {
    this.config = {useNewUrlParser: true, useFindAndModify: false};
  }

  connect() {
    mongoose.connect(process.env.DATABASE_URL || config.DATABASE.URL, this.config);
    mongoose.set('debug', true);
    return mongoose;
  }
}

module.exports = new MongoDB().connect();