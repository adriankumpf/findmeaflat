const notify = require('./notify');
const config = require('./config');
const xray = require('./scraper');
const Store = require('./store');

class FlatFinder {

  constructor(source) {
    if (typeof source.validate !== 'function' || !source.validate()) {
      throw "Not a valid source";
    }

    this._store = new Store(source.name);
    this._fullCrawl = true;
    this._source = source;
  }

  run() {
    return Promise.resolve(this._source.url)
      .then(this._getListings.bind(this))
      .then(this._process.bind(this))
      .then(this._filter.bind(this))
      .then(this._findNew.bind(this))
      .then(this._save.bind(this))
      .then(this._notify.bind(this));
  }

  _getListings(url) {
    return new Promise((resolve, reject) => {
      let x = xray(url, this._source.crawlContainer, [this._source.crawlFields]);

      if (!!this._source.paginage && this._fullCrawl) {
        this._fullCrawl = false;
        x = x.paginate(this._source.paginage);
      }

      x((err, listings) => {
        if (err) reject(err);
        resolve(listings);
      })

    })
  }

  _process(listings) {
    return listings.map(this._source.process);
  }

  _filter(listings) {
    return listings.filter(this._source.filter);
  }

  _findNew(listings) {
    return listings.filter(o => this._store.knownListings.indexOf(o.id) === -1)
  }

  _save(newListings) {
    if (newListings.length > 0) {
      this._store.knownListings = [...this._store.knownListings, ...(newListings.map(l => l.id))];
    }

    return newListings;
  }

  _notify(newListings) {
    if (newListings.length === 0) return;

    console.log(newListings.map(l => l.title).join("\n"));
    console.log(`-- Found ${newListings.length} new listing(s) --`);

    newListings.forEach(o => {
      notify.send(this._source.formatMsg(o));
    });
  }

}

module.exports = FlatFinder;
