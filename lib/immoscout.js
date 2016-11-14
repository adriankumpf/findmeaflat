const moment = require('moment');
const got = require('got');

const scrape = require('./scraper');
const notify = require('./notify');
const store = require('./store');

class Immoscout {

  run() {
    Promise.all([
      this._run(),
    ])
  }

  _run() {
    return this._getImmoscoutListings(store.urlImmoscout())
      .then(this._process)
      .then(this._filter)
      .then(this._findNew)
      .then(this._updateTimestamp)
      .then(this._notify)
  }

  _getImmoscoutListings(url) {
    return new Promise((resolve, reject) => {
      scrape(url, '#resultListItems article.result-list-entry', [{
        price: '.result-list-entry__criteria .grid-item:first-child dd | removeNewline | trim',
        size: '.result-list-entry__criteria .grid-item:nth-child(2) dd | removeNewline | trim',
        title: '.result-list-entry__brand-title-container h5 | removeNewline | trim',
        link: '.result-list-entry__brand-title-container@href',
        address: '.result-list-entry__address span'
      }]).paginate('#pager align-right a@href')((err, listings) => {
        if (err) reject(err);
        resolve(listings);
      })
    })
  }

  _process(listings) {
    return listings.map(o => {
      o.title = o.title.replace('NEU', '');
      o.id = parseInt(o.link.replace(/^.*\//, ''), 10);
      return o;
    })
  }

  _filter(listings) {
    return listings.filter(o => {
      const notBlacklisted = !(new RegExp(String.raw `\b(${store.blacklist.join("|")})\b`, 'ig').test(o.title));

      return notBlacklisted;
    })
  }

  _findNew(listings) {
    return listings
      .map(l => l.id)
      .filter(id => store.knownListings.indexOf(id) < 0)
      .map(id => listings.find(l => l.id === id));

  }

  _updateTimestamp(newListings) {
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
        `*${o.title}*\n${o.address.replace(/\(.*\),.*$/, '')} | ${o.price} [|](${o.link}) ${o.size}`
      )
    });
  }

}

module.exports = new Immoscout();
