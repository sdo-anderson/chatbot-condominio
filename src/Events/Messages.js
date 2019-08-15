const request = require("request");
require("dotenv/config");

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Send message text
 */
module.exports.sendMessage = (recipientId, messageText) => {
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
