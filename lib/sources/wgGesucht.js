const notify = require('../notify');
const config = require('../config');
const xray = require('../scraper');
const Store = require('../store');
const moment = require('moment');
const got = require('got');

const STUDIO_FLAT = 1;
const NORMAL_FLAT = 2;

class WgGesucht {

  constructor() {
    this[`store${STUDIO_FLAT}`] = new Store('wgGesucht.studioFlat');
    this[`store${NORMAL_FLAT}`] = new Store('wgGesucht.normalFlat');
  }

  run() {
    Promise.all([
      this._run(STUDIO_FLAT),
      this._run(NORMAL_FLAT),
    ])
  }

  _run(flatType) {
    return got.post(config.urlWgGesucht(flatType), { body: config.formWgGesucht(flatType), header: config.header })
      .then(() => {}, this._getRedirectLocation)
      .then(this._getListings)
      .then(this._process)
      .then(this._filter)
      .then(this._findNew.bind(this, flatType))
      .then(this._updateKnownListings.bind(this, flatType))
      .then(this._notify);
  }

  _getRedirectLocation(err) {
    if (err.response.statusCode !== 301) {
      throw Error(err.response.statusMessage);
    }
    return err.response.headers.location;
  }

  _getListings(url) {
    return new Promise((resolve, reject) => {
      xray(url, '#main_column .panel.panel-default:not(.panel-hidden)', [{
        id: '@id',
        sizePrice: '.detail-size-price-wrapper .detailansicht | removeNewline | trim',
        title: '.headline.printonly .detailansicht | removeNewline | trim',
        link: '.headline.printonly .detailansicht@href',
        details: '.row p | removeNewline | trim',
      }])((err, listings) => {
        if (err) reject(err);
        resolve(listings);
      })
    })
  }

  _process(listings) {
    return listings.map(o => {
      const sizePrice = o.sizePrice.split(' - ');
      const size = sizePrice[0];
      const price = sizePrice[1];

      const details = o.details.split(' Verfügbar: ab ');
      const address = details[0].split(' in ')[1];

      const id = parseInt(o.id.split('-').pop());
      const title = o.title;
      const link = o.link;

      return { id, title, size, price, address, link };
    })
  }

  _filter(listings) {
    return listings.filter(o => {
      const wishDistrict = new RegExp(config.wantedDistricts.join("|")).test(o.address);
      const notBlacklisted = !(new RegExp(String.raw `\b(${config.blacklist.join("|")})\b`, 'ig').test(o.title));

      return wishDistrict && notBlacklisted;
    })
  }

  _findNew(flatType, listings) {
    return listings
      .map(l => l.id)
      .filter(id => this[`store${flatType}`].knownListings.indexOf(id) < 0)
      .map(id => listings.find(l => l.id === id));

  }

  _updateKnownListings(flatType, newListings) {
    if (newListings.length > 0) {
      this[`store${flatType}`].knownListings = [...this[`store${flatType}`].knownListings, ...(newListings.map(l => l.id))];
    }

    return newListings;
  }

  _notify(newListings) {
    if (newListings.length === 0) return;

    console.log(newListings.map(l => l.title).join("\n"));
    console.log(`-- Found ${newListings.length} new listing(s) --`);

    newListings.forEach(o => {
      notify.send(
        `*${o.title.replace(/\*/g, '')}*\n${o.address.split(',')[0]} | ${o.price} [|](${o.link}) ${o.size}`
      )
    });
  }

}

module.exports = new WgGesucht();
