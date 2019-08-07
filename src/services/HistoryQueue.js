/**
 * Simple im-memory history storage with limited size
 */
class HistoryQueue {
  constructor(length, defaultValue = []) {
    this.length = length;
    this.queue = defaultValue;
  }

  get(index = null) {
    if(index)
      return this.queue[index];
    else
      return this.queue;
  }

  push(value) {
    if(this.queue.length === this.length) {
      this.queue.shift();
      this.queue.push(value);
    } else {
      this.queue.push(value);
    }
    return this.queue.length;
  }

}

module.exports = HistoryQueue;