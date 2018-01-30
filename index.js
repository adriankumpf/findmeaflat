require('rootpath')()

const fs = require('fs')
const path = './lib/sources'

const sources = fs.readdirSync(path).map(src => require(`${path}/${src}`))

function main () {
  Promise.all(sources.map(s => s.run().catch(console.error)))
}

setInterval(main, 60 * 60 * 1000)

main()
