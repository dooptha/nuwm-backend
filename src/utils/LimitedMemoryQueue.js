/**
 * Simple im-memory history storage with limited size
 */
class LimitedMemoryQueue {
  constructor(length = 10) {
    this.length = length;
    this.queue = new Map();
  }

  get(key = null) {
    if(key)
      return this.queue.get(key);
    else
      return Array.from(this.queue.values());
  }

  push(key, value) {
    if(this.queue.size === this.length) {
      const firstKey = this.queue.keys().next().value;
      this.queue.delete(firstKey);
      this.queue.set(key, value);
    } else {
      this.queue.set(key, value);
    }
    return this.queue.size;
  }

  delete(key) {
    return this.queue.delete(key);
  }
}

module.exports = LimitedMemoryQueue;