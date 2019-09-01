const Poll = require('../entites/Poll');

function create(question, options) {
  const poll = new Poll({
    question,
    options
  });
  return closeLastPoll()
    .then(() => poll.save())
    .then(poll => poll);
}

function getActivePoll(deviceId) {
  return Poll.aggregate([
      {$match: {active: true, closedAt: null}},
      {
        $addFields: {
          "voted": {
            $in: [deviceId, {
              $reduce: {
                input: "$options.voters",
                initialValue: [],
                in: {$concatArrays: ["$$value", "$$this"]}
              }
            }]
          },
        }
      }
    ]
  )
    .exec();
}

function closeLastPoll() {
  return Poll.findOneAndUpdate({
    active: true
  }, {
    active: false,
    closedAt: Date.now()
  })
    .exec()
}

function findById(id) {
  return Poll.findOne({id}).exec();
}

function update(id, data) {
  return Poll.findOneAndUpdate({id}, data, {new: true}).exec();
}

function getClosedPolls(page, offset = 10) {
  return Poll.find({active: false}).limit(offset).skip(page * offset).exec();
}

function vote(optionId, deviceId) {
  return Poll.findOneAndUpdate({
    "options.id": optionId,
    "options.voters": {$ne: deviceId}
  }, {
    $push: {
      'options.$.voters': deviceId
    },
    $inc: {
      votes: 1,
      'options.$.votes': 1
    }
  }, {
    new: true
  })
    .exec();
}

module.exports = {
  create,
  closeLastPoll,
  findById,
  getClosedPolls,
  update,
  vote,
  getActivePoll
};