const TelegramBot = require('node-telegram-bot-api');
const config = require('conf/config.json');

class Notify {
  constructor() {
    this._bot = new TelegramBot(config.telegram.token, { polling: false });
  };

  send(msg) {
    this._bot.sendMessage(config.telegram.chatId, msg, { parse_mode: "Markdown" });
  }
}

module.exports = new Notify();
