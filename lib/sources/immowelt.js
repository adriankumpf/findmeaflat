const FlatFinder = require('../flatfinder');
const Source = require('../source');
const config = require('../config');

class Immowelt {

  constructor() {
    const source = new Source();
    source.name = 'immowelt';
    source.url = config.urlImmowelt;
    source.crawlContainer = '.immoliste .js-object.listitem_wrap ';
    source.crawlFields = {
      id: '@data-estateid | int',
      price: '.hardfacts_3 .price_rent strong | removeNewline | trim',
      size: '.hardfacts_3 div:nth-child(2):not(.hardfactlabel)| removeNewline | trim',
      title: '.listcontent.clear h2',
      link: 'a@href',
      description: '.listconten_offset .listmerkmale| removeNewline | trim',
      address: '.listconten_offset .listlocation| removeNewline | trim',
    };
    source.paginate = '#pnlPaging #nlbPlus@href';
    source.process = o => {
      o.size = o.size.split('Wohnfläche')[0];
      return o;
    };
    source.filter = o => {
      const blacklist = new RegExp(String.raw `\b(${config.blacklist.join("|")})\b`, 'ig');
      const titleNotBlacklisted = !(blacklist).test(o.title);
      const descNotBlacklisted = !(blacklist).test(o.description);

      return titleNotBlacklisted && descNotBlacklisted;
    };
    source.formatMsg = o => `*${o.title.replace(/\*/g, '')}*\n${o.address.replace(/\(.*\),.*$/, '')} | ${o.price} [|](${o.link}) ${o.size}`;

    this._finder = new FlatFinder(source);
  }

  run() {
    this._finder.run();
  }

}

module.exports = new Immowelt();
