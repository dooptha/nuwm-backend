const mongoose = require('../index')

const eventSchema = new mongoose.Schema({
  pictureUrl: String,
  text: String,
  postUrl: String,
  messageId: String,
  sharingUrl: String,
  createdAt: {type: Date, default: () => Date.now()}
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
