const User = require('../entites/User');

function create(username, deviceId) {
  const user = new User({
    username,
    deviceId
  });
  return user.save().then(user => user);
}

function findByDeviceId(deviceId) {
  return User.findOne({ deviceId }, {_id: 0, deviceId: 0}).exec();
}

function update(deviceId, data) {
  return User.findOneAndUpdate({deviceId}, data, {new: true}).exec();
}

module.exports = {
  create,
  findByDeviceId,
  update
};