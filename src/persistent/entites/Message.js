const mongoose = require('../index')

const MESSAGES_COUNT = 50
const COLLECTION_SIZE = 1024 * 1024

const messageSchema = new mongoose.Schema({
  id: String,
  sender: {
    id: String,
    username: String
  },
  body: String,
  date: Date
},  { capped: { size: COLLECTION_SIZE, max: MESSAGES_COUNT } })

const Message = mongoose.model('Message', messageSchema)

module.exports = Message