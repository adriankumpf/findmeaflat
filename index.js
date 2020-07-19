require('rootpath')()

const fs = require('fs')

const PATH = './lib/sources'
const INTERVAL = 15 * 60 * 1000

const sources = fs.readdirSync(PATH).map((src) => require(`${PATH}/${src}`))

function main() {
  Promise.all(sources.map((s) => s.run().catch(console.error)))
}

setInterval(main, INTERVAL)

main()
