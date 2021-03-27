const FlatFinder = require('lib/flatfinder')
const config = require('conf/config.json')
const utils = require('lib/utils')

function normalize(o) {
  const address = o.address.split(' • ')[0]
  const price = o.price.split('€ ')[1].split(',-')[0] + ' €'
  const id = parseInt(o.id.split("'param':'")[1].split("'")[0], 10)
  const rooms = o.rooms + ' Zimmer'
  return { ...o, address, id, price, rooms }
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, config.blacklist)
  const descNotBlacklisted = !utils.isOneOf(o.description, config.blacklist)
  const wantedDistrict = utils.isOneOf(o.description, config.wantedDistricts)

  return wantedDistrict && titleNotBlacklisted && descNotBlacklisted
}

const enabled = !!config.providers.immosuchmaschine
const immosuchmaschine = {
  name: 'immosuchmaschine',
  enabled,
  url: !enabled || config.providers.immosuchmaschine.url,
  crawlContainer: '.result-list li',
  crawlFields: {
    id: '.data_title h3 a@data-js | removeNewline | trim',
    price: '.data_price span | removeNewline | trim',
    size:
      '.data_size dd | removeNewline | trim',
    title: '.data_title h3 a | removeNewline | trim',
    link: '.data_title h3 a@href | removeNewline | trim',
    description: '.data_desc span | removeNewline | trim',
    address: '.data_zipcity span | removeNewline | trim',
    rooms: '.data_rooms dd | removeNewline | trim',
  },
  paginate: '#srchrslt-pagination .pagination-next@href',
  normalize: normalize,
  filter: applyBlacklist,
}

module.exports = new FlatFinder(immosuchmaschine)
