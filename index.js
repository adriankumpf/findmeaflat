require('rootpath')()

const config = require('conf/config.json')
const fs = require('fs')
const util = require('util')

console.log('Set scraping interval to ' + (config.intervalInMinutes ? config.intervalInMinutes : 5) + ' min')

const PATH = './lib/sources'
const INTERVAL = (config.intervalInMinutes ? config.intervalInMinutes : 5)  * 60 * 1000

const sources = fs.readdirSync(PATH).map((src) => require(`${PATH}/${src}`))

function main() {
  Promise.all(
    sources.map((s) =>
      s.run().catch((e) => {
        console.error('Caught Error: ' + util.inspect(e, true, 2, true))
      })
    )
  )
}

setInterval(main, INTERVAL)

main()
