const FlatFinder = require('lib/flatfinder')
const config = require('conf/config.json')
const utils = require('lib/utils')

function normalize (o) {
  const address = o.address.split('\n')[4].trim()

  return Object.assign(o, { address })
}

function applyBlacklist (o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, config.blacklist)
  const descNotBlacklisted = !utils.isOneOf(o.description, config.blacklist)
  const wantedDistrict = utils.isOneOf(o.description, config.wantedDistricts)

  return wantedDistrict && titleNotBlacklisted && descNotBlacklisted
}

const kleinanzeigen = {
  name: 'kleinanzeigen',
  enabled: config.kleinanzeigen,
  url: config.kleinanzeigen.url,
  crawlContainer: '#srchrslt-adtable .ad-listitem',
  crawlFields: {
    id: '.aditem@data-adid | int',
    price: '.aditem-details strong | removeNewline | trim',
    size: '.aditem-main .text-module-end span:nth-child(2) | removeNewline | trim',
    title: '.aditem-main .text-module-begin a | removeNewline | trim',
    link: '.aditem-main .text-module-begin a@href | removeNewline | trim',
    description: '.aditem-main p:not(.text-module-end) | removeNewline | trim',
    address: '.aditem-details'
  },
  paginate: '#srchrslt-pagination .pagination-next@href',
  normalize: normalize,
  filter: applyBlacklist
}

module.exports = new FlatFinder(kleinanzeigen)
