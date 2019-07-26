const mongoose = require("../index");
const ROLES = require('../../../config').AUTH.ROLES;


const userSchema = new mongoose.Schema({
  username: String,
  deviceId: String,
  role: { type: String, default: ROLES.USER },
  registeredAt: {type: Date, default: Date.now()}
});

const User = mongoose.model('User', userSchema);

module.exports = User;