require('rootpath')()

const fs = require('fs')
const path = './lib/sources'
const sources = fs.readdirSync(path)

setInterval((function exec () {
  sources.forEach(source => require(`${path}/${source}`).run())
  return exec
}()), 60 * 60 * 1000)
