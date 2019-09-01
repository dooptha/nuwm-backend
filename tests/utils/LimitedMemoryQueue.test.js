process.env.NODE_ENV = 'testing';

const chai = require("chai");
const LimitedMemoryQueue = require("../../src/utils/LimitedMemoryQueue");

chai.should();

const expect = chai.expect;

describe("utils", () => {
  describe("LimitedMemoryQueue.js", () => {
    it("should push new value", () => {
      const queue = new LimitedMemoryQueue(25);
      queue.push("one", {value: "two"});
      expect(queue.length).to.be.equal(1);
    });

    it("should return pushed value by key", () => {
      const queue = new LimitedMemoryQueue(5);
      queue.push("one", {value: "two"});
      expect(queue.get("one")).to.be.deep.equal({value: "two"});
    });

    it("should delete value by key", () => {
      const queue = new LimitedMemoryQueue(5);
      queue.push("one", {value: "two"});
      queue.delete("one");
      expect(queue.length).to.be.equal(0);
    });

    it("should remove first element and push new if reached size limit", () => {
      const queue = new LimitedMemoryQueue(5);
      return new Promise(resolve => {
        for(let i = 0; i <= 6; i++) {
          queue.push(i, {value: i * 10});
        }
        resolve(queue)
      })
        .then(_ => {
          expect(queue.length).to.be.equal(5);
          expect(queue.get(0)).to.be.equal(null);
          expect(queue.get(6)).to.be.deep.equal({value: 6 * 10});
        });
    })
  });
});