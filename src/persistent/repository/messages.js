const Message = require('../entites/Message');

function save(data) {
 const message = new Message(data);
 return message.save();
}

function getAll() {
  return Message.find({}).exec();
}

function remove(id) {
  return Message.deleteOne({id}).exec()
}

module.exports = {save, getAll, remove};