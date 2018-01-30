const { shorten } = require('lib/utils')
const Store = require('lib/store')

const notify = require('lib/services/notify')
const xray = require('lib//services/scraper')

class FlatFinder {
  constructor (source) {
    this._fullCrawl = true
    this._source = source
    this._store = new Store(source.name)
  }

  async run () {
    const { enabled, normalize, filter, name } = this._source

    if (!enabled) return

    const newListings = (await this._getListings())
      .map(normalize)
      .filter(filter)
      .filter(o => this._store.knownListings.indexOf(o.id) === -1)

    console.log(`-- ${name} : ${newListings.length} --`)

    if (newListings.length < 1) return

    await this._notify(newListings)

    this._save(newListings)
  }

  _getListings () {
    const { crawlFields, crawlContainer, paginage, url } = this._source

    return new Promise((resolve, reject) => {
      let x = xray(url, crawlContainer, [crawlFields])

      if (paginage && this._fullCrawl) {
        this._fullCrawl = false
        x = x.paginate(paginage)
      }

      x((err, listings) => (err ? reject(err) : resolve(listings)))
    })
  }

  _notify (newListings) {
    console.log(newListings.map(l => shorten(l.title, 100)).join('\n'))

    const sendAll = newListings.map(o =>
      notify.send(
        `*${shorten(o.title.replace(/\*/g, ''), 45)}*\n` +
          [o.address, o.price, o.size].join(' | ') +
          '\n' +
          `[LINK](${o.link})`
      )
    )

    return Promise.all(sendAll)
  }

  _save (newListings) {
    return this._store.add(newListings.map(l => l.id))
  }
}

module.exports = FlatFinder
