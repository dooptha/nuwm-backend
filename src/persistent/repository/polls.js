const Poll = require('../entites/Poll');

function create(username, deviceId) {
  const user = new Poll({
    username,
    deviceId
  });
  return user.save().then(user => user);
}

function findByDeviceId(deviceId) {
  return Poll.findOne({ deviceId }).exec();
}

function update(deviceId, data) {
  return Poll.findOneAndUpdate({deviceId}, data, {new: true}).exec();
}

module.exports = {
  create,
  findByDeviceId,
  update
};