const FlatFinder = require('../flatfinder');
const Source = require('../source');
const config = require('../config');

class Kleinanzeigen {

  constructor() {
    const source = new Source();
    source.name = 'kleinanzeigen';
    source.url = config.urlKleinanzeigen();
    source.crawlContainer = '#srchrslt-adtable .ad-listitem';
    source.crawlFields = {
      id: '.aditem@data-adid | int',
      price: '.aditem-details strong | removeNewline | trim',
      size: '.aditem-main .text-module-end span:nth-child(2) | removeNewline | trim',
      title: '.aditem-main .text-module-begin a | removeNewline | trim',
      link: '.aditem-main .text-module-begin a@href | removeNewline | trim',
      description: '.aditem-main p:not(.text-module-end) | removeNewline | trim',
      district: '.aditem-details'
    };
    source.paginate = '#srchrslt-pagination .pagination-next@href';
    source.filter = o => {
      const blacklist = new RegExp(String.raw `\b(${config.blacklist.join("|")})\b`, 'ig');
      const titleNotBlacklisted = !(blacklist).test(o.title);
      const descNotBlacklisted = !(blacklist).test(o.description);
      const wantedDistrict = (new RegExp(String.raw `\b(${config.wantedDistricts.join("|")})\b`, 'ig')).test(o.district);

      return wantedDistrict && titleNotBlacklisted && descNotBlacklisted;
    };
    source.formatMsg = o => `*${o.title.replace(/\*/g, '')}*\n${o.district.split("\n")[4].trim()} | ${o.price} [|](${o.link}) ${o.size}`;

    this._finder = new FlatFinder(source);
  }

  run() {
    this._finder.run();
  }

}

module.exports = new Kleinanzeigen();
