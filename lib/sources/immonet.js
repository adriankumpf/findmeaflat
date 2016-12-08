const FlatFinder = require('../flatfinder');
const Source = require('../source');
const config = require('../config');

class Immonet {

  constructor() {
    const source = new Source();
    source.name = 'immonet';
    source.url = config.urlImmonet;
    source.crawlContainer = '#idResultList .search-object';
    source.crawlFields = {
      id: '.search-info a@id',
      price: '#keyfacts-bar div:first-child span',
      size: '#keyfacts-bar div:nth-child(2) .text-primary-highlight',
      title: '.search-info a | removeNewline | trim',
      link: '.search-info a@href',
      address: '.search-info p | removeNewline | trim',
    };
    source.paginate = '#idResultList .margin-bottom-6.margin-bottom-sm-12 .panel a.pull-right@href';
    source.process = o => {
      o.id = parseInt(o.id.split('_')[1], 10);
      o.title = o.title.replace('NEU ', '');
      o.address = o.address.split(' - ')[1]
      return o;
    };
    source.filter = o => !(new RegExp(String.raw `\b(${config.blacklist.join("|")})\b`, 'ig').test(o.title));
    source.formatMsg = o => `*${o.title.replace(/\*/g, '')}*\n${o.address.replace(/\(.*\),.*$/, '')} | ${o.price} [|](${o.link}) ${o.size}`;

    this._finder = new FlatFinder(source);
  }

  run() {
    this._finder.run();
  }

}

module.exports = new Immonet();
