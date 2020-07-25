const TelegramBot = require('tg-yarl')

const { telegram } = require('conf/config.json')

const bot = new TelegramBot(telegram.token)

const util = require('util')

async function send(msg) {
  try {
    const response = await bot.sendMessage(telegram.chatId, msg, {
      parse_mode: 'Markdown',
    })

    return response
  } catch (e) {
    if (e.kind == 'HTTPError') {
      console.error('HTTP Error: ' + util.inspect(e, true, 2, true))
    }

    throw e
  }
}

module.exports = { send }
