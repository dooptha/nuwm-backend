const mongoose = require('mongoose');
const config = require('../../config');

class MongoDB {
  constructor() {
    this.config = {useNewUrlParser: true, useFindAndModify: false};
  }

  connect() {
    mongoose.connect(config.DATABASE.URL, this.config);
    return mongoose;
  }
}

module.exports = new MongoDB().connect();