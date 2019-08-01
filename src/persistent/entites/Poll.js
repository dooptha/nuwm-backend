const mongoose = require("../index");
const nanoid = require("nanoid");

const pollSchema = new mongoose.Schema({
  id: {type: String, default: nanoid()},
  question: String,
  active: Boolean,
  options: [{
    id: {type: String, default: nanoid()},
    value: String,
    votes: {type: Number, default: 0}
  }],
  votes: {type: Number, default: 0},
  endsAt: Date,
  createdAt: {type: Date, default: Date.now()}
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;