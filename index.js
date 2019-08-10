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

app.get("/", (req, res) => {
  res.send({ status: "Conectado ao Server" });
});

app.use("/webhook", (request, response) => {
  if (request.method === "GET") {
    if (
      request.query["hub.mode"] === "subscribe" &&
      request.query["hub.verify_token"] === process.env.VERIFY_TOKEN
    )
      response.status(200).send(request.query["hub.challenge"]);
    else response.status(403).send("GET FAIL");
  } else if (request.method === "POST") {
    console.log("Post req -> ", request);
    var data = request.body;
    if (data && data.object === "page") {
      data.entry.forEach(function(entry) {
        entry.messaging.forEach(function(event) {
          var dataHora = new Date();
          if (event.message) {
            console.log("evento de mensagem em " + dataHora.toGMTString());
            this.sendMessage(event.recipient.id, "Mensagem recebida");
            //tratarMensagem(event);
          } else if (event.postback && event.postback.payload) {
            console.log("evento de botao em " + dataHora.toGMTString());
            //tratarClickBotao(event);
          }
        });
      });
      response.send("POST OK");
    } else response.status(403).send("POST FAIL");
  } else response.status(403).send("REQUEST FAIL");
});

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
