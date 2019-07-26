const User = require('../entites/User');

function create(username, deviceId) {
  const user = new User({
    username,
    deviceId
  });
  console.log("user", user);
  return user.save().then(user => user);
}

function findByDeviceId(deviceId) {
  return User.findOne({ deviceId }).exec();
}

module.exports = {
  create,
  findByDeviceId
};