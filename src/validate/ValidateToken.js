require("dotenv/config");

/**
 * @author Anderson Oliveira
 * @copyright 08/2019
 * @description Check the messenger password and handle the message
 */
module.exports.validateToken = (mode, token) => {
  return mode === "subscribe" && token === process.env.VERIFY_TOKEN;
};
