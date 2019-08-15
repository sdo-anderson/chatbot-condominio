require("dotenv/config");

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check the messenger password and handle the message
 */
module.exports.getValidate = (request, response) => {
  if (
    request.query["hub.mode"] === "subscribe" &&
    request.query["hub.verify_token"] === process.env.VERIFY_TOKEN
  )
    response.status(200).send(request.query["hub.challenge"]);
  else response.status(403).send("GET FAIL");
};
