const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../src/server");

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Students", () => {
  describe("GET /", () => {
    // Test to get all students record
    it("should get all students record", (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});