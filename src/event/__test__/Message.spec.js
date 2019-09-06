let chai = require("chai"),
  expect = chai.expect;

let messages = require("../Message");

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check route webhook with fail
 */
describe("Messages Test", async () => {
  it("it should send message", async () => {
    const mensagem = await messages.sendMessage(0, "Teste");

    expect(mensagem.json.recipient)
      .to.have.property("id")
      .equal(0);

    expect(mensagem.json.message)
      .to.have.property("text")
      .equal("Teste");
  });
});
