/**
 * Simple im-memory history storage with limited size
 */
class LimitedMemoryQueue {
  constructor(length = 10) {
    this.length = length;
    this.queue = [];
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

  delete(value) {
    const index = this.queue.indexOf(value);
    return this.queue.splice(index, 1);
  }
}

module.exports = LimitedMemoryQueue;