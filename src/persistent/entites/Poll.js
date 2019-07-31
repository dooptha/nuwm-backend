const mongoose = require("../index");
const nanoid = require("nanoid");

const userSchema = new mongoose.Schema({
  id: {type: String, default: nanoid()},
  question: String,
  options: {type: Array},
  active: {type: Boolean},
  createdAt: {type: Date, default: Date.now()}
});

const Poll = mongoose.model('Poll', userSchema);

module.exports = Poll;