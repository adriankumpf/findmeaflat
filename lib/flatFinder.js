const moment = require('moment');
const got = require('got');

const scrape = require('./scraper');
const notify = require('./notify');
const store = require('./store');

class FlatFinder {

  run() {
    got.post(store.url, { body: store.searchCriteria, header: store.header })
      .then(() => {}, this._getRedirectLocation)
      .then(this._getOfferings)
      .then(this._process)
      .then(this._filter)
      .then(this._sort)
      .then(this._findNew)
      .then(this._notify)
  }

  _getRedirectLocation(err) {
    if (err.response.statusCode !== 301) throw Error(err.response.statusMessage);
    return err.response.headers.location;
  }

  _getOfferings(url) {
    return new Promise((resolve, reject) => {
      scrape(url, '#main_column .panel.panel-default', [{
          sizePrice: '.detail-size-price-wrapper .detailansicht | removeNewline | trim',
          title: '.headline.printonly .detailansicht | removeNewline | trim',
          link: '.headline.printonly .detailansicht@href',
          details: '.row p | removeNewline | trim',
          created: '.row.noprint .pull-right script',
        }])
        .paginate('.pagination.pagination-sm li:last-child a@href')((err, offerings) => {
          if (err) reject(err);
          resolve(offerings);
        })
    })
  }

  _process(offerings) {
    return offerings.map(o => {
      const sizePrice = o.sizePrice.split(' - ');
      const size = parseInt(sizePrice[0].replace('m²', ''), 10);
      const price = parseInt(sizePrice[1].replace('€', ''), 10);

      const details = o.details.split(' Verfügbar: ab ');
      const address = details[0].replace('1-Zimmer-Wohnung in', '');
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

  _filter(offerings) {
    return offerings.filter(o => {
      const wishDistrict = new RegExp(store.wantedDistricts.join("|")).test(o.address);
      const notBlacklisted = !(new RegExp(String.raw `\b(${store.blacklist.join("|")})\b`, 'ig').test(o.title));

      return wishDistrict && notBlacklisted;
    })
  }

  _sort(offerings) {
    return offerings.sort((a, b) => {
      if (a.created > b.created) return 1;
      if (a.created < b.created) return -1;
      return 0;
    });
  }

  _findNew(offerings) {
    return offerings.filter(o => o.created > store.timestamp);
  }

  _notify(newOfferings) {
    if (newOfferings.length === 0) return;

    console.log(`Found ${newOfferings.length} new offerings.`);

    newOfferings.forEach(o => {
      notify.send(
        `*${o.title}*\n${o.address.split(',')[0]} | ${o.price}€ [|](${o.link}) ${o.size}m²`
      )
    });

    store.timestamp = Math.max(...newOfferings.map(o => o.created));
  }

}

module.exports = new FlatFinder();