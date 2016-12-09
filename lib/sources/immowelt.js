const FlatFinder = require('../flatfinder');
const config = require('../../conf/config.json');
const utils = require('../utils');

function normalize(o) {
  const size = o.size.split('Wohnfläche')[0];
  const address = o.address

  return Object.assign(o, { size, address });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isBlacklisted(o.title, config.blacklist);
  const descNotBlacklisted = !utils.isBlacklisted(o.description, config.blacklist);

  return titleNotBlacklisted && descNotBlacklisted;
}

const immowelt = {
  name: 'immowelt',
  url: config.immowelt.url,
  crawlContainer: '.immoliste .js-object.listitem_wrap ',
  crawlFields: {
    id: '@data-estateid | int',
    price: '.hardfacts_3 .price_rent strong | removeNewline | trim',
    size: '.hardfacts_3 div:nth-child(2):not(.hardfactlabel)| removeNewline | trim',
    title: '.listcontent.clear h2',
    link: 'a@href',
    description: '.listconten_offset .listmerkmale| removeNewline | trim',
    address: '.listconten_offset .listlocation| removeNewline | trim',
  },
  paginate: '#pnlPaging #nlbPlus@href',
  process: normalize,
  filter: applyBlacklist,
};

module.exports = new FlatFinder(immowelt);
