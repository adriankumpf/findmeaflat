const storage = require('lowdb/lib/file-async');
const low = require('lowdb');
const path = require('path');

const DB_PATH = path.dirname(require.main.filename) + '/conf/ts.json';
const lowdb = low(DB_PATH, { storage });

class Store {

  constructor(name) {
    this._name = name;
  };

  set timestamp(value) {
    lowdb
      .set(`timestamps.${this._name}`, parseInt(value, 10))
      .value();
  }

  get timestamp() {
    return lowdb
      .get(`timestamps.${this._name}`)
      .value() || 0;
  }

  set knownListings(value) {
    if (!Array.isArray(value)) throw Error('Not a valid array');

    lowdb
      .set(`knownListings.${this._name}`, value)
      .value();
  }

  get knownListings() {
    return lowdb
      .get(`knownListings.${this._name}`)
      .value() || [];
  }

}

module.exports = Store;