const Poll = require('../entites/Poll');

function create(question, options) {
  const poll = new Poll({
    question,
    options
  });
  return poll.save().then(poll => poll);
}

function findById(id) {
  return Poll.findOne({ id }).exec();
}

function update(id, data) {
  return Poll.findOneAndUpdate({id}, data, {new: true}).exec();
}

function getClosed(page, offset = 10) {
  return Poll.find({active: false}).limit(offset).skip(page * offset).exec();
}

function vote(id, optionId) {
  return Poll.findOneAndUpdate({id, "options.id": optionId}, {$inc: {votes: 1}}).exec();
}

module.exports = {
  create,
  findById,
  getClosed,
  update,
  vote
};