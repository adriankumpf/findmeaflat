const { shorten } = require('lib/utils')
const Store = require('lib/store')

const notify = require('lib/notify')
const xray = require('lib/scraper')

class FlatFinder {
  constructor(source) {
    this._fullCrawl = true
    this._source = source
    this._store = new Store(source.name)
  }

  async run() {
    const { enabled, normalize, filter, name } = this._source

    if (!enabled) return

    const listings = await Promise.race([
      this._getListings(),
      new Promise((_, r) => setTimeout(() => r(new Error(`Timeout: _getListings@${this._source.name}`)) , 60000))
    ])

    const newListings = listings
      .map(normalize)
      .filter(filter)
      .filter(o => this._store.knownListings.indexOf(o.id) === -1)

    console.log(`-- ${name} : ${newListings.length} --`)

    if (newListings.length < 1) return

    await this._notify(newListings)

    this._save(newListings)
  }

  _getListings() {
    const { crawlFields, crawlContainer, paginate, url } = this._source

    return new Promise((resolve, reject) => {
      let x = xray(url, crawlContainer, [crawlFields])

      if (paginate && this._fullCrawl) {
        this._fullCrawl = false
        x = x.paginate(paginate)
      }

      x((err, listings) => {
        return err ? reject(err) : resolve(listings)
      })
    })
  }

  async _notify(newListings) {
    for (const listing of newListings) {
      console.log(shorten(listing.title, 100))

      const msg =
        `*${shorten(listing.title.replace(/\*/g, ''), 45)}*\n` +
        [listing.address, listing.price, listing.size].join(' | ') +
        '\n' +
        `[LINK](${listing.link})`

      await notify.send(msg)
      await new Promise(r => setTimeout(r, 1500))
    }
  }

  _save(newListings) {
    return this._store.add(newListings.map(l => l.id))
  }
}

module.exports = FlatFinder
