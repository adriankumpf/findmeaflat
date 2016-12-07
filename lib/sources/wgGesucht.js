const FlatFinder = require('../flatfinder');
const Source = require('../source');
const config = require('../config');
const got = require('got');

const STUDIO_FLAT = 1;
const NORMAL_FLAT = 2;

class WgGesucht {

  constructor() {
    const studioSource = this._setupSource('wgGesucht.studioFlat', STUDIO_FLAT);
    const normalSource = this._setupSource('wgGesucht.normalFlat', NORMAL_FLAT);

    this._studioFinder = new FlatFinder(studioSource);
    this._normalFinder = new FlatFinder(normalSource);
  }

  run() {
    Promise.all([
      this._studioFinder.run(),
      this._normalFinder.run(),
    ])
  }

  _getRedirectLocation(err) {
    if (err.response.statusCode !== 301) {
      throw Error(err.response.statusMessage);
    }
    return err.response.headers.location;
  }

  _setupSource(name, flatType) {
    const source = new Source();
    source.name = name;
    source.url = got.post(config.urlWgGesucht(flatType), { body: config.formWgGesucht(flatType), header: config.header })
      .then(() => {}, this._getRedirectLocation);
    source.crawlContainer = '#main_column .panel.panel-default:not(.panel-hidden)';
    source.crawlFields = {
      id: '@id',
      sizePrice: '.detail-size-price-wrapper .detailansicht | removeNewline | trim',
      title: '.headline.printonly .detailansicht | removeNewline | trim',
      link: '.headline.printonly .detailansicht@href',
      details: '.row p | removeNewline | trim',
    };
    source.process = o => {
      const sizePrice = o.sizePrice.split(' - ');
      const size = sizePrice[0];
      const price = sizePrice[1];

      const details = o.details.split(' Verfügbar: ab ');
      const address = details[0].split(' in ')[1];

      const id = parseInt(o.id.split('-').pop());
      const title = o.title;
      const link = o.link;

      return { id, title, size, price, address, link };
    };
    source.filter = o => {
      const wishDistrict = new RegExp(config.wantedDistricts.join("|")).test(o.address);
      const notBlacklisted = !(new RegExp(String.raw `\b(${config.blacklist.join("|")})\b`, 'ig').test(o.title));

      return wishDistrict && notBlacklisted;
    };
    source.formatMsg = o => `*${o.title.replace(/\*/g, '')}*\n${o.address.split(',')[0]} | ${o.price} [|](${o.link}) ${o.size}`

    return source;
  }

}

module.exports = new WgGesucht();
