const TelegramBot = require('tg-yarl')

const { telegram } = require('conf/config.json')

const bot = new TelegramBot(telegram.token)

function send (msg) {
  return bot.sendMessage(telegram.chatId, msg, { parse_mode: 'Markdown' })
}

module.exports = { send }
