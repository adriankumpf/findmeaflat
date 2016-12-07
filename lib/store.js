const storage = require('lowdb/lib/file-async');
const low = require('lowdb');
const path = require('path');

const DB_PATH = path.dirname(require.main.filename) + '/conf/ts.json';
const lowdb = low(DB_PATH, { storage });

class Store {

  constructor(name) {
    this._name = name;
  };

  set knownListings(value) {
    if (!Array.isArray(value)) throw Error('Not a valid array');

    lowdb
      .set(this._name, value)
      .value();
  }

  get knownListings() {
    return lowdb
      .get(this._name)
      .value() || [];
  }

}

module.exports = Store;
