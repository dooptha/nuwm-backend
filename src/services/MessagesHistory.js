const messages = require('../persistent/repository/messages');
const EventEmitter = require('events');

/**
 * Simple implementation of event based in-memory query
 * where callbacks will be called one-by-one
 * this implementation will guaranty the order
 * Cons:
 *    Unexpected behavior on promise rejection
 *    Can't be used in cluster mode or with multiple server instances
 */
class MessagesHistory extends EventEmitter {
  constructor() {
    super();
    this.query = [];

    this.setupEvents();
  }

  setupEvents() {
    this.on('save', (message) => this.queried(MessagesHistory.saveMessage.bind(this, message)));
  }

  queried(callback) {
    this.query.push(callback);
    if (this.query.length === 1) {
      this.next();
    }
  }

  next() {
    if (this.query[0])
      this.query[0].call(this, () => {
        this.query.shift();
        this.next.call(this);
      })
        .then(() => {
          this.query.shift();
          this.next.call(this);
        });
  }

  static saveMessage(message) {
    return messages.save(message);
  }

  static getLastMessages() {
    return messages.getAll();
  }

  static remove(id) {
    return messages.remove(id);
  }
}

module.exports = MessagesHistory;