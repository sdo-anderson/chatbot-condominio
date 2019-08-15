const express = require("express");
// const helmet = require("helmet");
// const compression = require("compression");
const bodyParser = require("body-parser");
const validate = require("./src/Functions/getValidate");
const request = require("request");
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
  res.send({ status: "Conectado ao Server" });
});

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Define method and redirect function
 */
app.use("/webhook", (request, response) => {
  if (request.method === "GET") {
    return validate.getValidate(request, response);
  } else if (request.method === "POST") {
    let body = request.body;
    if (body && body.object === "page") {
      body.entry.forEach(function(entry) {
        entry.messaging.forEach(function(event) {
          if (event.message) {
            this.sendMessage(event.sender.id, "Mensagem recebida");
          } else if (event.postback && event.postback.payload) {
            this.sendMessage(event.sender.id, "Evento de botão recebido");
          }
        });
      });
      response.status(200).send("POST OK");
    } else response.status(401).send("POST FAIL");
  } else response.status(402).send("REQUEST FAIL");
});

/**	//Protegendo o express contra determinados HTTP Headers
 * @author Anderson Oliveira	// app.use(helmet());
 * @copyright 08/2019
 * @description Show server status	//Compressao das rotas
 */
sendMessage = (recipientId, messageText) => {
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: {
        access_token: process.env.ACCESS_TOKEN
      },
      method: "POST",
      json: {
        recipient: {
          id: recipientId
        },
        message: {
          text: messageText
        }
      }
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200)
        console.log("Mensagem recebida!!!");
      else
        console.log("Erro ao receber mensagem!!! ", error, response.body.error);
    }
  );
};

//Para prevenir erros nos testes
if (!module.parent) {
  app.listen(process.env.PORT, (req, res) => {
    console.log("Server ativo na porta:", process.env.PORT);
  });
}

module.exports = app;
