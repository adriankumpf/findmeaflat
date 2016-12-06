const notify = require('../notify');
const xray = require('../scraper');
const store = require('../store');
const moment = require('moment');
const got = require('got');

class Kleinanzeigen {

  run() {
    Promise.all([
      this._run(),
    ])
  }

  _run() {
    return this._getKleinanzeigenListings(store.urlKleinanzeigen())
      .then(this._filter)
      .then(this._findNew)
      .then(this._updateKnownListings)
      .then(this._notify)
  }

  _getKleinanzeigenListings(url) {
    return new Promise((resolve, reject) => {
      xray(url, '#srchrslt-adtable .ad-listitem', [{
        id: '.aditem@data-adid | int',
        price: '.aditem-details strong | removeNewline | trim',
        size: '.aditem-main .text-module-end span:nth-child(2) | removeNewline | trim',
        title: '.aditem-main .text-module-begin a | removeNewline | trim',
        link: '.aditem-main .text-module-begin a@href | removeNewline | trim',
        description: '.aditem-main p:not(.text-module-end) | removeNewline | trim',
        district: '.aditem-details'
      }]).paginate('#srchrslt-pagination .pagination-next@href')((err, listings) => {
        if (err) reject(err);
        resolve(listings);
      })
    })
  }

  _filter(listings) {
    return listings.filter(o => {
      const blacklist = new RegExp(String.raw `\b(${store.blacklist.join("|")})\b`, 'ig');
      const titleNotBlacklisted = !(blacklist).test(o.title);
      const descNotBlacklisted = !(blacklist).test(o.description);
      const wantedDistrict = (new RegExp(String.raw `\b(${store.wantedDistricts.join("|")})\b`, 'ig')).test(o.district);

      return wantedDistrict && titleNotBlacklisted && descNotBlacklisted;
    })
  }

  _findNew(listings) {
    return listings
      .map(l => l.id)
      .filter(id => store.knownListings.indexOf(id) < 0)
      .map(id => listings.find(l => l.id === id));

  }

  _updateKnownListings(newListings) {
    if (newListings.length > 0) {
      store.knownListings = [...store.knownListings, ...(newListings.map(l => l.id))];
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
