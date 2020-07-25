const FileSync = require('lowdb/adapters/FileSync')
const low = require('lowdb')
const path = require('path')

const DB_PATH = path.dirname(require.main.filename) + '/db/listing.json'
const db = low(new FileSync(DB_PATH))

class Store {
  constructor(name) {
    db.defaults({ [name]: [] }).write()
    this._name = name
  }

  get knownListings() {
    return db.get(this._name).value()
  }

  addListing(listingId) {
    db.get(this._name).push(listingId).write()
  }
}

module.exports = Store
