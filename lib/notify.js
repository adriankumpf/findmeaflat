const TelegramBot = require('tg-yarl')

const { random } = require('lib/utils')
const { telegram } = require('conf/config.json')

const bot = new TelegramBot(telegram.token)

async function send(msg) {
  try {
    return await sendMessage(msg)
  } catch (e) {
    if (e.name == 'HTTPError' && e.response && e.response.statusCode == 429) {
      const json = JSON.parse(e.response.body)

      const retryAfter = (json.parameters && json.parameters.retry_after) || 60

      const sleepFor = random(retryAfter, retryAfter + 10)
      console.log(`Too many messages sent. Retrying in ${sleepFor} seconds …`)
      await new Promise((r) => setTimeout(r, sleepFor * 1000))

      return await sendMessage(msg)
    }

    throw e
  }
}

function sendMessage(msg) {
  return bot.sendMessage(telegram.chatId, msg, { parse_mode: 'Markdown' })
}

module.exports = { send }
