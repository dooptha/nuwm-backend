const Event = require('../entites/Event')

function save(data) {
  const event = new Event(data)
  return event.save()
}

function remove(messageId) {
  return Event.deleteOne({messageId}).exec()
}

function getList(page, offset = 5) {
  return Event.find().limit(offset).skip(page * offset).exec()
}

module.exports = { save, remove, getList }
