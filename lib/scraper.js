const config = require('../conf/config.json');
const Xray = require('x-ray');
const got = require('got');

class Scraper {

  constructor() {
    this.x = Xray({
      filters: {
        trim: value => {
          return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value;
        },
        removeNewline: value => {
          return typeof value === 'string' ? value.replaceAll('\n', '') : value;
        }
      }
    })
  }

  go() {
    got.post(config.url, {
        body: config.options
      })
      .then(() => {}, this._getRedirectLocation)
      .then(this._findOfferings.bind(this))
  }

  _getRedirectLocation(err) {
    if (err.response.statusCode !== 301) {
      throw Error(err.response.statusMessage);
    }

    return err.response.headers.location;
  }

  _findOfferings(url) {
    this.x(url, '#main_column .panel.panel-default', [{
      title: '.headline.printonly .detailansicht | removeNewline | trim',
      sizePrice: '.detail-size-price-wrapper .detailansicht | removeNewline | trim',
      details: '.row p | removeNewline | trim',
      link: '.headline.printonly .detailansicht@href',
        }])((err, offerings) => {
      if (err) {
        throw Error(err)
      }

      console.log(offerings);
    })
  }

}

module.exports = new Scraper();