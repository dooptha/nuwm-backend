const Message = require('../entites/Message')

function save(data) {
  const message = new Message(data)
  return message.save()
}

function getAll() {
  return Message.find({}).exec()
}

// When you are using capped collections in mongodb you can't update/remove documents
function removeAll() {
  return Message.collection.drop()
}

module.exports = {save, getAll, removeAll}