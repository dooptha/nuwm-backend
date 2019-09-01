const LimitedMemoryQueue = require('../utils/LimitedMemoryQueue');

const MESSAGES_QUEUE_LIMIT_SIZE = 50;

const messagesQueue = new LimitedMemoryQueue(MESSAGES_QUEUE_LIMIT_SIZE);

module.exports = messagesQueue;