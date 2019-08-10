const express = require("express");
// const helmet = require("helmet");
// const compression = require("compression");
// const bodyParser = require("body-parser");
const request = require("request");
require("dotenv/config");

//Carregando o Express
const app = express();

//Protegendo o express contra determinados HTTP Headers
// app.use(helmet());

//Compressao das rotas
// app.use(compression());

//Registrando um parser de JSON
// app.use(bodyParser.json({ limit: "5mb", extended: true }));

/**	//Protegendo o express contra determinados HTTP Headers
 * @author Anderson Oliveira	// app.use(helmet());
 * @copyright 08/2019
 * @description Show server status	//Compressao das rotas
 */
app.get("/", (req, res) => {
  res.send({ status: "Conectado ao Server" });
});

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check the messenger password and handle the message
 */
app.use("/webhook", (request, response) => {
  if (request.method === "GET") {
    if (
      request.query["hub.mode"] === "subscribe" &&
      request.query["hub.verify_token"] === process.env.VERIFY_TOKEN
    )
      response.status(200).send(request.query["hub.challenge"]);
    else response.status(403).send("GET FAIL");
  } else if (request.method === "POST") {
    var data = request.body;
    if (data && data.object === "page") {
      data.entry.forEach(function(entry) {
        entry.messaging.forEach(function(event) {
          if (event.message) {
            this.sendMessage(event.recipient.id, "Mensagem recebida");
          } else if (event.postback && event.postback.payload) {
            this.sendMessage(event.recipient.id, "Evento de botão recebido");
          }
        });
      });
      response.send("POST OK");
    } else response.status(403).send("POST FAIL");
  } else response.status(403).send("REQUEST FAIL");
});

/**	//Protegendo o express contra determinados HTTP Headers
 * @author Anderson Oliveira	// app.use(helmet());
 * @copyright 08/2019
 * @description Show server status	//Compressao das rotas
 */
sendMessage = (recipientId, messageText) => {
  let messaData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: {
        access_token: process.env.ACCESS_TOKEN
      },
      method: "POST",
      json: messaData
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200)
        console.log("Mensagem recebida!!!");
      else console.log("Erro ao receber mensagem!!!");
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
