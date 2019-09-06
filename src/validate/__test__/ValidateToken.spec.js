let chai = require("chai"),
  expect = chai.expect;
const nock = require("nock");

let server = require("../../../index");
let { validateToken } = require("../ValidateToken");

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check route webhook with success
 */
describe("ValidateToken Test", () => {
  it("it should validate token", done => {
    expect(validateToken("subscribe", process.env.VERIFY_TOKEN)).equal(true);
    done();
  });
}).timeout(5000);
