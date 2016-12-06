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
      .then(this._sort)
      .then(this._findNew.bind(this, flatType))
      .then(this._updateTimestamp.bind(this, flatType))
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
      xray(url, '#main_column .panel.panel-default', [{
          sizePrice: '.detail-size-price-wrapper .detailansicht | removeNewline | trim',
          title: '.headline.printonly .detailansicht | removeNewline | trim',
          link: '.headline.printonly .detailansicht@href',
          details: '.row p | removeNewline | trim',
          created: '.row.noprint .pull-right script',
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
      const available = details[1];

      const title = o.title;
      const link = o.link;

      const created = moment(
        o.created
        .split(';')
        .find(line => line.includes('var ad_post_date'))
        .split('\'')[1],
        "DD.MM.YYYY, HH:mm"
      ).valueOf();

      return { title, size, price, address, available, created, link };
    })
  }

  _filter(listings) {
    return listings.filter(o => {
      const wishDistrict = new RegExp(config.wantedDistricts.join("|")).test(o.address);
      const notBlacklisted = !(new RegExp(String.raw `\b(${config.blacklist.join("|")})\b`, 'ig').test(o.title));

      return wishDistrict && notBlacklisted;
    })
  }

  _sort(listings) {
    return listings.sort((a, b) => {
      if (a.created > b.created) return 1;
      if (a.created < b.created) return -1;
      return 0;
    });
  }

  _findNew(flatType, listings) {
    return listings.filter(o => o.created > this[`store${flatType}`].timestamp);
  }

  _updateTimestamp(flatType, newListings) {
    if (newListings.length > 0) {
      const latestListing = Math.max(...(newListings.map(l => l.created)));
      this[`store${flatType}`].timestamp = latestListing;
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
