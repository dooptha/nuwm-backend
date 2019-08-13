process.env.NODE_ENV = 'testing';
process.env.DATABASE_URL = "mongodb+srv://tester:testerpasswordfordooptha@dooptha-53f7s.mongodb.net/doophta-test?retryWrites=true&w=majority";

const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../../src/server");
const {version} = require('../../package');

// Configure chai
chai.use(chaiHttp);
chai.should();

const expect = chai.expect;

describe("Index Route", () => {
  describe("GET /", () => {
    it("should return a html page", (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('string');
          done();
        });
    });

    it("should return current version", (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.text).to.include(version);
          done();
        });
    });
  });
});