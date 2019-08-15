let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check route root with status 200
 */
describe("GET root", () => {
  it("it should GET the status", done => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("status").equal("Conectado ao Server");
        done();
      });
  });
});

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check route webhook with fail
 */
describe("GET webhook", () => {
  it("it should GET the fail status", done => {
    chai
      .request(server)
      .get("/webhook")
      .end((err, res) => {
        res.should.have.status(403);
        res.should.have.property("text").equal("GET FAIL");
        done();
      });
  });
});

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check route webhook with success
 */
describe("GET webhook", () => {
  it("it should GET the success status", done => {
    chai
      .request(server)
      .get(
        "/webhook?hub.mode=subscribe&hub.verify_token=" +
          process.env.VERIFY_TOKEN +
          "&hub.challenge=teste"
      )
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property("text").equal("teste");
        done();
      });
  });
});

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check route webhook with fail
 */
describe("POST webhook", () => {
  it("it should POST response", done => {
    chai
      .request(server)
      .post("/webhook")
      .end((err, res) => {
        res.should.have.status(403);
        res.should.have.property("text").equal("POST FAIL");
        done();
      });
  }).timeout(3000);
});

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check route webhook with fail
 */
describe("PATCH webhook", () => {
  it("it should PATCH fail response", done => {
    let payload = {};
    chai
      .request(server)
      .patch("/webhook")
      .send(payload)
      .end((err, res) => {
        res.should.have.status(403);
        res.should.have.property("text").equal("REQUEST FAIL");
        done();
      });
  }).timeout(3000);
});
