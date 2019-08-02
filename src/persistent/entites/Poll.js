const mongoose = require("../index");
const nanoid = require("nanoid");

const pollSchema = new mongoose.Schema({
  id: {type: String, default: nanoid()},
  question: String,
  active: {type: Boolean, default: true},
  options: [{
    id: {type: String, default: nanoid()},
    value: String,
    votes: {type: Number, default: 0}
  }],
  votes: {type: Number, default: 0},
  closedAt: {type: Date, default: null},
  createdAt: {type: Date, default: Date.now()}
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;