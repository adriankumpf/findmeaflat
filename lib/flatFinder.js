const moment = require('moment');
const got = require('got');

const scrape = require('./scraper');
const store = require('./store');

class FlatFinder {

  run() {
    got.post(store.url, { body: store.searchCriteria, header: store.header })
      .then(() => {}, this._getRedirectLocation)
      .then(this._findOfferings.bind(this))
      .then(this._normalizeOfferings.bind(this))
      .then(this._filterOfferings)
      .then(result => console.log(result))
  }

  _getRedirectLocation(err) {
    if (err.response.statusCode !== 301) throw Error(err.response.statusMessage);
    return err.response.headers.location;
  }

  _findOfferings(url) {
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

  _normalizeOfferings(offerings) {
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
      );

      return { title, size, price, address, available, created, link };
    })
  }

  _filterOfferings(offerings) {
    return offerings.filter(o => {
      const wishDistrict = new RegExp(store.wantedDistricts.join("|")).test(o.address);
      const noSwaps = !(new RegExp(/tausch|swap/, 'i').test(o.title));

      return wishDistrict && noSwaps;
    })
  }

}

module.exports = new FlatFinder();