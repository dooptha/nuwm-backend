const mongoose = require('mongoose');
const config = require('../../config');

class MongoDB {
  constructor() {
    this.config = {useNewUrlParser: true, useFindAndModify: false};
  }

  connect() {
    const databaseUrl = process.env.DATABASE_URL || config.DATABASE.URL;
    mongoose.connect(databaseUrl, this.config);
    mongoose.set('debug', true);
    console.info("Active DATABASE_URL: ", databaseUrl);
    return mongoose;
  }
}

module.exports = new MongoDB().connect();