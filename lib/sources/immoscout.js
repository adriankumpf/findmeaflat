const FlatFinder = require('../flatfinder');
const Source = require('../source');
const config = require('../config');

class Immoscout {

  constructor() {
    const source = new Source();
    source.name = 'immoscout';
    source.url = config.urlImmoscout();
    source.crawlContainer = '#resultListItems li.result-list__listing';
    source.crawlFields = {
      id: '.result-list-entry@data-obid | int',
      price: '.result-list-entry .result-list-entry__criteria .grid-item:first-child dd | removeNewline | trim',
      size: '.result-list-entry .result-list-entry__criteria .grid-item:nth-child(2) dd | removeNewline | trim',
      title: '.result-list-entry .result-list-entry__brand-title-container h5 | removeNewline | trim',
      link: '.result-list-entry .result-list-entry__brand-title-container@href',
      address: '.result-list-entry .result-list-entry__address span'
    };
    source.paginate = '#pager .align-right a@href';
    source.filter = o => !(new RegExp(String.raw `\b(${config.blacklist.join("|")})\b`, 'ig').test(o.title));
    source.formatMsg = o => `*${o.title.replace('NEU', '').replace(/\*/g, '')}*\n${o.address.replace(/\(.*\),.*$/, '')} | ${o.price} [|](${o.link}) ${o.size}`;

    this._finder = new FlatFinder(source);
  }

  run() {
    this._finder.run();
  }

}

module.exports = new Immoscout();
