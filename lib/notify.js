const TelegramBot = require('tg-yarl')

const { telegram } = require('conf/config.json')

const bot = new TelegramBot(telegram.token)

const util = require('util')

function send(msg) {
  return bot
    .sendMessage(telegram.chatId, msg, { parse_mode: 'Markdown' })
    .catch((e) => {
      if (e.kind == 'HTTPError') {
        console.log(util.inspect(e, true, 2, true))
      }

      throw e
    })
}

module.exports = { send }
