/**
 * Simple im-memory history storage with limited size
 */
class LimitedMemoryQueue {
  constructor(length = 10) {
    this._length = length;
    this.queue = new Map();
  }

  get length() {
    return this.queue.size;
  }

  get(key = null) {
    if (key !== null) {
      const value = this.queue.get(key);
      return value ? value : null;
    }
    return Array.from(this.queue.values());
  }

  push(key, value) {
    if (key === undefined || key === null)
      throw new Error("'key' is required filed");
    if (this.queue.size === this._length) {
      const firstKey = this.queue.keys().next().value;
      this.queue.delete(firstKey);
      this.queue.set(key, value);
    } else {
      this.queue.set(key, value);
    }
    return this.length;
  }

  delete(key) {
    return this.queue.delete(key);
  }
}

module.exports = LimitedMemoryQueue;