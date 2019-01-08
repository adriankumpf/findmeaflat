const makeDriver = require('request-x-ray')
const config = require('conf/config.json')
const Xray = require('x-ray')

function removeNewline (value) {
  return typeof value === 'string' ? value.replace(/\\n/g, '') : value
}

function trim (value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value
}

function int (value) {
  return typeof value === 'string' ? parseInt(value, 10) : value
}

const filters = {
  removeNewline: removeNewline,
  trim: trim,
  int: int
}

const driver = makeDriver({
  headers: {
    'User-Agent': config.userAgent
  }
})

module.exports = Xray({ filters }).driver(driver)
          .concurrency(4)
          .throttle(1, 1000)
          .delay(100, 250)
          .limit(100);
