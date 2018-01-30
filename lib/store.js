const FileSync = require('lowdb/adapters/FileSync')
const low = require('lowdb')
const path = require('path')

const DB_PATH = path.dirname(require.main.filename) + '/db/listing.json'
const db = low(new FileSync(DB_PATH))

class Store {
  constructor (name) {
    db.defaults({ [name]: [] }).write()
    this._name = name
  }

  get knownListings () {
    return db.get(this._name).value()
  }

  add (listingIds) {
    if (!Array.isArray(listingIds)) throw Error('bad_listings_format')

    db
      .get(this._name)
      .push(...listingIds)
      .write()
  }
}

module.exports = Store
