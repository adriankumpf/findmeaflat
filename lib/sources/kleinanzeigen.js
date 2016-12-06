const notify = require('../notify');
const config = require('../config');
const xray = require('../scraper');
const Store = require('../store');

class Kleinanzeigen {

  constructor() {
    this._store = new Store('kleinanzeigen');
    this._fullCrawl = true;
  }

  run() {
    return this._getKleinanzeigenListings(config.urlKleinanzeigen())
      .then(this._filter)
      .then(this._findNew.bind(this))
      .then(this._updateKnownListings.bind(this))
      .then(this._notify)
  }

  _getKleinanzeigenListings(url) {
    return new Promise((resolve, reject) => {
      let x = xray(url, '#srchrslt-adtable .ad-listitem', [{
        id: '.aditem@data-adid | int',
        price: '.aditem-details strong | removeNewline | trim',
        size: '.aditem-main .text-module-end span:nth-child(2) | removeNewline | trim',
        title: '.aditem-main .text-module-begin a | removeNewline | trim',
        link: '.aditem-main .text-module-begin a@href | removeNewline | trim',
        description: '.aditem-main p:not(.text-module-end) | removeNewline | trim',
        district: '.aditem-details'
      }]);

      if (this._fullCrawl) {
        this._fullCrawl = false;
        x = x.paginate('#srchrslt-pagination .pagination-next@href')
      }

      x((err, listings) => {
        if (err) reject(err);
        resolve(listings);
      })
    })
  }

  _filter(listings) {
    return listings.filter(o => {
      const blacklist = new RegExp(String.raw `\b(${config.blacklist.join("|")})\b`, 'ig');
      const titleNotBlacklisted = !(blacklist).test(o.title);
      const descNotBlacklisted = !(blacklist).test(o.description);
      const wantedDistrict = (new RegExp(String.raw `\b(${config.wantedDistricts.join("|")})\b`, 'ig')).test(o.district);

      return wantedDistrict && titleNotBlacklisted && descNotBlacklisted;
    })
  }

  _findNew(listings) {
    return listings
      .map(l => l.id)
      .filter(id => this._store.knownListings.indexOf(id) < 0)
      .map(id => listings.find(l => l.id === id));

  }

  _updateKnownListings(newListings) {
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
      notify.send(
        `*${o.title.replace(/\*/g, '')}*\n${o.district.split("\n")[4].trim()} | ${o.price} [|](${o.link}) ${o.size}`
      )
    });
  }

}

module.exports = new Kleinanzeigen();