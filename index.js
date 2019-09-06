const express = require("express");
// const helmet = require("helmet");
// const compression = require("compression");
const bodyParser = require("body-parser");
const { validateToken } = require("./src/validate/ValidateToken");
const { sendMessage } = require("./src/event/Message");
require("dotenv/config");

//Load Express
app = express().use(bodyParser.json());

//Protegendo o express contra determinados HTTP Headers
// app.use(helmet());

//Compressao das rotas
// app.use(compression());

//Registrando um parser de JSON
// app.use(bodyParser.json({ limit: "5mb", extended: true }));

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Show server status
 */
app.get("/", (req, res) => {
  res.status(200).send({ status: "Conectado ao Server" });
});

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Define method and redirect function
 */
app.use("/webhook", (request, response) => {
  if (request.method === "GET") {
    const validate = validateToken(
      request.query["hub.mode"] === "subscribe",
      request.query["hub.verify_token"]
    );
    if (validate)
      return response.status(200).send(request.query["hub.challenge"]);
    response.status(403).send("GET FAIL");
  } else if (request.method === "POST") {
    let body = request.body;
    if (body && body.object === "page") {
      body.entry.forEach(function(entry) {
        entry.messaging.forEach(function(event) {
          const message = {};
          if (event.message) {
            message = sendMessage(event.sender.id, "Mensagem recebida");
          } else if (event.postback && event.postback.payload) {
            message = sendMessage(event.sender.id, "Evento de botão recebido");
          }
          request(message, (error, response, body) => {
            if (!error && response.statusCode === 200)
              console.log("Mensagem recebida!!!");
            else {
              console.log(
                "Erro ao receber mensagem!!! ",
                error,
                response.body.error
              );
            }
          });
        });
      });
      response.status(200).send("POST OK");
    } else response.status(403).send("POST FAIL");
  } else response.status(403).send("REQUEST FAIL");
});

//Para prevenir erros nos testes
if (!module.parent) {
  app.listen(process.env.PORT, (req, res) => {
    console.log("Server ativo na porta:", process.env.PORT);
  });
}

module.exports = app;
