const notify = require('lib/services/notify');
const xray = require('lib//services/scraper');
const { shorten } = require('lib/utils');
const Store = require('lib/store');

class FlatFinder {

  constructor(source) {
    this._store = new Store(source.name);
    this._fullCrawl = true;
    this._source = source;
  }

  run() {
    return Promise.resolve(this._source.url)
      .then(this._getListings.bind(this))
      .then(this._normalize.bind(this))
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

  _normalize(listings) {
    return listings.map(this._source.normalize);
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

    console.log(newListings.map(l => shorten(l.title)).join("\n"));
    console.log(`-- Found ${newListings.length} new listing(s) --`);

    newListings.forEach(o => {
      notify.send(
        `*${shorten(o.title.replace(/\*/g, ''))}*\n` +
        `${o.address} | ${o.price} [|](${o.link}) ${o.size}`
      );
    });
  }

}

module.exports = FlatFinder;
