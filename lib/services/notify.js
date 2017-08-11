const TelegramBot = require('tg-yarl')
const config = require('conf/config.json')

class Notify {
  constructor () {
    this._bot = new TelegramBot(config.telegram.token)
  }

  send (msg) {
    const opts = { parse_mode: 'Markdown' }
    return this._bot.sendMessage(config.telegram.chatId, msg, opts)
  }
}

module.exports = new Notify()
