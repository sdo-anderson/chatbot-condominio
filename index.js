const express = require("express");
const request = require("request");

require("dotenv/config");

const app = express();

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
 * @description Check the messenger password and handle the message
 */
app.use("/webhook", (request, response) => {
  if (request.method === "GET") {
    if (
      request.query["hub.mode"] === "subscribe" &&
      request.query["hub.verify_token"] === "senha-configurada-no-messenger"
    )
      response.status(200).send(request.query["hub.challenge"]);
    else response.status(403).send("GET FAIL");
  } else if (request.method === "POST") {
    var data = request.body;
    if (data && data.object === "page") {
      data.entry.forEach(function(entry) {
        entry.messaging.forEach(function(event) {
          var dataHora = new Date();
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

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Send response message
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
        access_token: "XXX..."
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

module.exports = app;
